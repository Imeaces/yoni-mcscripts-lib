// @ts-nocheck
import { Minecraft, VanillaWorld, StatusCode, VanillaScoreboard, overworld } from "../basis.js";
 
import { Command } from "../command.js";
import { Entry, EntryType } from "./Entry.js";
import { NameConflictError, ScoreRangeError, ObjectiveUnregisteredError, UnknownEntryError } from "./ScoreboardError.js"
import {
    useOptionalFasterCode,
    enableScoreboardIdentityByNumberIdQuery,
    emitLegacyMode } from "../config.js";
import { EntityBase } from "../entity.js";

/**
 * @typedef {import("../entity.js").YoniEntity} YoniEntity
 */

/**
 * 检查传入的参数是否为整数数字，并且在 [-2^31, 2^31-1] 的区间。
 * @param {...number} scores 要检查的变量。
 * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
 */
function checkScoreIsInRange(...scores){
    for (let s of scores){
        if (Number.isInteger(s) === false
        || s > 2147483647
        || s < -2147483648){
            throw new ScoreRangeError();
        }
    }
}

/**
 * 记分项记录了参与者以及他们的分数。
 */
class Objective {
    #scoreboard;
    #objectiveOptions;
    #id;
    #criteria;
    #displayName;
    #unregistered = false;
    #vanillaObjective;
    
    get scoreboard(){
        return this.#scoreboard;
    }

    /**
     * 记分项的标识符。
     * @returns {string}
     */
    get id(){
        return this.#id;
    }
    
    /**
     * 记分项的准则，应该为 `"dummy"`。
     * @returns {"dummy"}
     */
    get criteria(){
        return this.#criteria;
    }
    
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     */
    get displayName(){
        return this.#displayName;
    }
    
    /** 
     * 此记分项对象是否只允许使用 `getScore()`
     * （此功能未实现）。
     * @returns {boolean} 表示是否此记分项对象只允许使用 `getScore()`。
     */
    isReadOnly(){
        this.checkUnregistered();
        return !!this.#objectiveOptions?.readonly;
    }
    
    /**
     * 检测此对象对应的记分项是否已经被移除。
     * @returns {boolean} 检测结果。若已被移除，返回 `true`，否则返回 `false`。
     */
    isUnregistered(){
        if (!this.#unregistered){
            let currentVanillaObjective = VanillaScoreboard.getObjective(this.#id);
            if (currentVanillaObjective === undefined
            || currentVanillaObjective === null
            || (
                currentVanillaObjective !== this.#vanillaObjective
                && currentVanillaObjective !== this.#vanillaObjective?.vanillaObjective
            )){
                this.#unregistered = true;
            }
        }
        return this.#unregistered;
    }

    /**
     * 检查此对象对应的记分项是否被移除。
     * @throws 当此对象对应的记分项被移除时，抛出 `ObjectiveUnregisteredError`。
     */
    checkUnregistered(){
        if (this.isUnregistered())
            throw new ObjectiveUnregisteredError(this.#id);
    }
    
    /**
     * 原始记分项对象。
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象。
     */
    get vanillaObjective(){
        return this.#vanillaObjective;
    }
    
    /**
     * 将此对象对应的记分项从记分板上移除。
     */
    unregister(){
        this.checkUnregistered();
        
        VanillaScoreboard.removeObjective(this.#id);
    }
    
    /**
     * @hideconstructor
     */
    constructor(...args){
        
        if (args.length === 1){
            let { scoreboard, vanillaObjective, name, displayName, criteria, objectiveOptions } = args[0];
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        } else {
            let [ scoreboard, name, criteria, displayName, vanillaObjective, objectiveOptions ] = args;
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        }
    }
    
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postAddScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayerCommand("add", entry, score)
            .then(() => {});
    }
    
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     * 
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    postRandomScore(entry, min=-2147483648, max=2147483647, useBuiltIn=true){
        checkScoreIsInRange(min, max);
        if (useBuiltIn) {
            //在想能不能把这东西拿来随机
            //((Math.max(Math.random()*Math.random()/Math.random(), Math.random()/Math.random()*Math.random())*1000000000000000000 >>2 | 0 )<<8 )|0
            let vals = max - min;
            let randomScore = vals * Math.random();
            let result = Math.round(randomScore + min);
            return this.postSetScore(entry, result);
        } else {
            if (min > max){
                throw new Error("min > max");
            }
            return this.#postPlayerCommand("random", entry, min, max)
                .then(() => {});
        }
    }
    
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    async postRemoveScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayerCommand("remove", entry, score)
            .then(() => {});
    }
    
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScore(entry){
        return this.#postPlayerCommand("reset", entry)
            .then(() => {});
    }
    
    /**
     * 重置所有在此记分项上的分数持有者的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScores(){
        this.checkUnregistered();
        return Command.add(Command.PRIORITY_HIGHEST, 
            Command.getCommandMoreStrict("scoreboard", "players", "reset", "*", this.#id))
            .then(rt => {
                if (rt.statusCode !== StatusCode.success){
                    throw new Error(rt.statusMessage);
                }
            });
    }
    
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @returns {Promise<number>} 由 `score` 指定的新分数。
     * 完成操作后，将会敲定并返回 `score`。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postSetScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayerCommand("set", entry, score)
            .then(() => score);
    }
    
    /**
     * 异步获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<number>} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    postGetScore(entry){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        return this.#postGetScore(entry);
    }
    async #postGetScore(entry){
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        } catch {
            this.checkUnregistered();
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            } catch {
                return undefined;
            }
        }
    }
    
    /**
     * 为分数持有者在记分项上执行特定的操作。
     * @param {string} option - 操作类型。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {...any} args - 操作所需要的参数。
     * @returns {Promise<true>} 操作成功。
     * @throws 未知的命令错误。
     * @throws 若尝试为虚拟玩家设置分数，且世界中有相同名字的玩家时，抛出 `NameConflictError`。
     */
    #postPlayerCommand(option, entry, ...args){
        let { entity, name, type } = Objective.findCommandRequirement(entry);
               
        if (type === EntryType.PLAYER || type === EntryType.ENTITY){
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, "@s", this.#id);
            return Command.addExecuteParams(Command.PRIORITY_HIGHEST, entity, cmd, ...args)
                .then((rt) => {
                    if (rt.statusCode === StatusCode.success){
                        return true;
                    }
                    this.checkUnregistered();
                    
                    //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                    throw new Error(`Could not ${option} score, `
                        + "maybe entity or player disappeared?"
                        + "\n  cause by: "
                        + rt.statusMessage);
                });
        } else {
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, name, this.#id);
            return Command.addParams(Command.PRIORITY_HIGHEST, cmd, ...args)
                .then((rt) => {
                    if (rt.statusCode === StatusCode.success){
                        return true;
                    }
                    this.checkUnregistered();
                    
                    if ([...VanillaWorld.getPlayers({name})].length !== 0)
                        throw new NameConflictError(name);
                        
                    //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                    throw new Error(`Could not ${option} score, `
                        + "maybe entity or player disappeared?"
                        + "\n  cause by: "
                        + rt.statusMessage);
                });
        } 
    }
    
    /**
     * 为分数持有者在记分项上执行特定的操作。
     * @param {string} option - 操作类型。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {...any} args - 操作所需要的参数。
     * @throws 未知的命令错误。
     * @throws 若尝试为虚拟玩家设置分数，且世界中有相同名字的玩家时，抛出 `NameConflictError`。
     */
    __playerCommand(option, entry, ...args): void{
        let { entity, name, type } = Objective.findCommandRequirement(entry);
        
        if (type === EntryType.PLAYER || type === EntryType.ENTITY){
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, "@s", this.#id);
            cmd = Command.getCommand(cmd, ...args);
            let result = Command.execute(entity, cmd);
            if (result.statusCode !== StatusCode.success){
                this.checkUnregistered();
                //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                throw new Error(`Could not ${option} score, `
                    + "maybe entity or player disappeared?"
                    + "\n  cause by: "
                    + result.statusMessage);
            }
        } else {
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, name, this.#id);
            cmd = Command.getCommand(cmd, ...args);
            let result = Command.run(entity, cmd);
            if (result.statusCode !== StatusCode.success){
                this.checkUnregistered();
                if ([...VanillaWorld.getPlayers({name})].length !== 0)
                    throw new NameConflictError(name);
                
                //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                throw new Error(`Could not ${option} score, `
                    + "maybe entity or player disappeared?"
                    + "\n  cause by: "
                    + rt.statusMessage);
            }
        }
    }
    
    /**
     * 寻找用于在记分项上执行特定的操作的与分数持有者有关的信息。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     */
    static findCommandRequirement(entry): {name?: string, type: string, entity?: EntityBase}{
        let name = null;
        let type = null;
        let entity = null;
        if (entry instanceof Entry || entry instanceof Minecraft.ScoreboardIdentity){
            type = entry.type;
            if (type === EntryType.ENTITY || type === EntryType.PLAYER){
                try {
                    entity = entry.getEntity();
                } catch {
                    throw new Error("Could not find the entity");
                }
                if (entity == null)
                    throw new Error("Could not find the entity");
            } else {
                name = entry.displayName;
                type = EntryType.FAKE_PLAYER;
            }
        } else if (entry instanceof EntityBase || entry instanceof Minecraft.Entity || entry instanceof Minecraft.Player){
            if (EntityBase.entityIsPlayer(entry))
                type = EntryType.PLAYER;
            else
                type = EntryType.ENTITY;
            entity = entry;
        } else if (typeof entry === "string"){
            type = EntryType.FAKE_PLAYER;
            name = entry;
        } else if (isFinite(Number(entry))){
            if (!enableScoreboardIdentityByNumberIdQuery)
                throw new Error("scbid search by number id is disable, set 'enableScoreboardIdentityByNumberIdQuery' to 'true' to enable it");
            return Objective.findCommandRequirement(Entry.getEntry({id: entry}));
        } else {
            throw new UnknownEntryError();
        }
        
        return { type, entity, name };
    }
    
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {number} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    getScore(entry){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        } catch {
            this.checkUnregistered();
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            } catch {
                return undefined;
            }
        }
    }
    
    /**
     * 获取在此记分项上拥有分数记录的分数持有者。
     * @returns {Entry[]} 一个包含了在记分项上的分数持有者的数组。
     */
    getEntries(){
        this.checkUnregistered();
        
        return Array.from(this.vanillaObjective.getParticipants())
            .map((scbid) => Entry.getEntry({scbid, type: scbid.type}) );
    }
    
    /**
     * 遍历在此记分项上拥有分数记录的所有分数持有者，为其创建一个
     * `ScoreInfo` 对象，表示了这些分数持有者在此记分项上的分数。
     * @returns {ScoreInfo[]} 一个数组，包含了所有在此记分项上拥有分数记录的分数持有者的 `ScoreInfo` 对象。
     */
    getScoreInfos(){
        this.checkUnregistered();
        
        return Array.from(this.getEntries())
            .map((_)=>{
                return this.getScoreInfo(_);
            });
    }
    
    /**
     * 获取一个 `ScoreInfo` 对象，表示了分数持有者以及他在此记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     */
    getScoreInfo(entry, autoInit=false){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);

        let scoreInfo = new ScoreInfo(this, entry);
        if (autoInit == true && scoreInfo.score == null)
            scoreInfo.score = 0;
        return scoreInfo;
    }
    
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    setScore(entry, score){
        return this.postSetScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上减少分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    removeScore(entry, score){
        return this.postRemoveScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     * 
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    randomScore(entry, min=-2147483647, max=2147483647, useBuiltIn=true){
        return this.postRandomScore.apply(this, arguments);
    }
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    resetScore(entry){
        return this.postResetScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上增加分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param score - 要增加的分数。
     * @returns 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    addScore(entry, score: number): Promise<void>{
        return this.postAddScore.apply(this, arguments);
    }
}

/**
 * 一个对象，包含了分数持有者，以及其在某一记分项上的分数。
 * @deprecated 无法保证某些属性可以正常工作。
 */
class ScoreInfo {
    #entry;
    #objective;
    
    /**
     * @param {Objective} obj
     * @param {Entry} entry
     */
    constructor(obj, entry){
        if (!(obj instanceof Objective))
            throw new TypeError("Not an Objective type");
        if (!(entry instanceof Entry))
            throw new TypeError("Not an Entry type");
        this.#objective = obj;
        this.#entry = entry;
    }
    
    /**
     * @param {number} score
     */
    set score(score){
        this.#objective.setScore(this.#entry, score);
    }
    
    /**
     * @type {number}
     * 分数持有者在记分项上的分数
     */
    get score(){
        return this.#objective.getScore(this.#entry);
    }
    
    /**
     * 重置此对象对应的分数持有者在对应的记分项上的分数。
     */
    reset(){
        return this.#objective.resetScore(this.#entry);
    }
    
    getEntry(){
        return this.#entry;
    }
    
    getObjective(){
        return this.#objective;
    }
    
    toString(){
        return `ScoreInfo { Score: ${this.score}, Entry: ${this.getEntry().id} }`;
    }
    
}

if (emitLegacyMode){
    Objective.prototype.addScore = function addScore(entry, score){
        if (overworld.runCommand){
            checkScoreIsInRange(score);
            this.__playerCommand("add", entry, score);
            return;
        }
        return this.postAddScore.apply(this, arguments);
    }
    Objective.prototype.removeScore = function removeScore(entry, score){
        if (overworld.runCommand){
            checkScoreIsInRange(score);
            this.__playerCommand("remove", entry, score);
            return;
        }
        return this.postRemoveScore.apply(this, arguments);
    }
    Objective.prototype.setScore = function setScore(entry, score){
        if (overworld.runCommand){
            checkScoreIsInRange(score);
            this.__playerCommand("set", entry, score);
            return score;
        }
        return this.postSetScore.apply(this, arguments);
    }
    Objective.prototype.resetScore = function resetScore(entry){
        if (overworld.runCommand){
            this.__playerCommand("reset", entry);
            return;
        }
        return this.postResetScore.apply(this, arguments);
    }
    Objective.prototype.randomScore = function randomScore(entry, min, max, useBuiltin=true){
        if (overworld.runCommand){
            checkScoreIsInRange(min, max);
            if (useBuiltIn) {
                let vals = max - min;
                let randomScore = vals * Math.random();
                let result = Math.round(randomScore + min);
                return this.setScore(entry, result);
            } else {
                if (min > max){
                    throw new Error("min > max");
                }
                this.__playerCommand("random", entry, min, max);
            }
            return;
        }
        return this.postRandomScore.apply(this, arguments);
    }
}

export { Objective, ScoreInfo };
export default Objective;
