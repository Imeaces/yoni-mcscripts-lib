import { Gametest, Minecraft, VanillaWorld, StatusCode, VanillaScoreboard, overworld } from "../basis.js";
 
import { ScoreboardEntry } from "./ScoreboardEntry.js";
import { EntryValueType, EntryType } from "./EntryType.js";
import { ScoreInfo } from "./ScoreInfo.js";
import {
    NameConflictError,
    ScoreRangeError,
    ObjectiveUnregisteredError,
    UnknownEntryError
} from "./ScoreboardError.js"
import { config } from "../config.js";
import { EntityUtils } from "../EntityUtils.js";
import { Command } from "../command.js";

import type { Scoreboard } from "./Scoreboard.js";
import type { EntityValue } from "../types";

/**
 * 检查传入的参数是否为整数数字，并且在 [-2^31, 2^31-1] 的区间。
 * @param {...any} scores 要检查的变量。
 * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
 */
function checkScoreIsInRange(...scores: any[]){
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
    
    #scoreboard: typeof Scoreboard;
    
    /**
     * @type {string}
     */
    #id: string;
    
    /**
     * @type {string}
     */
    #criteria: string;
    
    /**
     * @type {string}
     */
    #displayName: string;
    
    /**
     * @type {boolean}
     */
    #unregistered: boolean = false;
    
    /**
     * @type {Minecraft.ScoreboardObjective}
     */
    #vanillaObjective: Minecraft.ScoreboardObjective;
    
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
     * @returns {string}
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
     * 检测此对象对应的记分项是否已经被移除。
     * @returns {boolean} 检测结果。若已被移除，返回 `true`，否则返回 `false`。
     */
    isUnregistered(){
        if (!this.#unregistered && this.#scoreboard.tryGetObjective(this.#id) !== this){
            this.#unregistered = true;
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
    get vanillaObjective(): Minecraft.ScoreboardObjective {
        return this.#vanillaObjective;
    }
    
    /**
     * 将此对象对应的记分项从记分板上移除。
     */
    unregister(){
        this.checkUnregistered();
        
        VanillaScoreboard.removeObjective(this.#id);
    }
    
    constructor(scoreboard: typeof Scoreboard, name: string, criteria: string, displayName: string, options?: {
        vanillaObjective?: Minecraft.ScoreboardObjective,
        readOnlyMode?: boolean,
    }){
        this.#scoreboard = scoreboard;
        this.#id = name;
        this.#criteria = criteria;
        this.#displayName = displayName;
        this.#vanillaObjective = options?.vanillaObjective as Minecraft.ScoreboardObjective;
    }
    
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {number} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    getScore(one: EntryValueType): number | undefined {
        let identity = ScoreboardEntry.getIdentity(one);
        
        if (identity instanceof Gametest.SimulatedPlayer){
            identity = ScoreboardEntry.guessEntry(one).vanillaScoreboardIdentity as Minecraft.ScoreboardIdentity;
            if (identity === undefined)
                return undefined;
        }
        
        try {
            return this.vanillaObjective.getScore(identity);
        } catch {
            this.checkUnregistered();
            return undefined;
        }
    }
    
    /**
     * 获取在此记分项上拥有分数记录的分数持有者。
     * @returns {ScoreboardEntry[]} 一个包含了在记分项上的分数持有者的数组。
     */
    getEntries(): ScoreboardEntry[] {
        this.checkUnregistered();
        const entries: ScoreboardEntry[] = [];
        for (const identity of this.vanillaObjective.getParticipants()){
            const entry = ScoreboardEntry.getEntry(identity.type as unknown as EntryType, identity);
            entries.push(entry);
        }
        return entries;
    }
    
    /**
     * 遍历在此记分项上拥有分数记录的所有分数持有者，为其创建一个
     * `ScoreInfo` 对象，表示了这些分数持有者在此记分项上的分数。
     * @returns {ScoreInfo[]} 一个数组，包含了所有在此记分项上拥有分数记录的分数持有者的 `ScoreInfo` 对象。
     */
    getScoreInfos(): ScoreInfo[] {
        this.checkUnregistered();
        const infos: ScoreInfo[] = [];
        for (const entry of this.getEntries()){
            const info = this.getScoreInfo(entry);
            infos.push(info);
        }
        return infos;
    }
    
    /**
     * 获取一个 `ScoreInfo` 对象，表示了分数持有者以及他在此记分项上的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     */
    getScoreInfo(one: EntryValueType, autoInit: boolean = false){
        let entry = ScoreboardEntry.guessEntry(one);
        
        let scoreInfo = new ScoreInfo(this, entry);
        
        if (autoInit == true && scoreInfo.score == null)
            scoreInfo.score = 0;
        
        return scoreInfo;
    }
    
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    setScore(one: EntryValueType, score: number){
        checkScoreIsInRange(score);
        
        let identity = ScoreboardEntry.getIdentity(one);
        
        //目前Gametest.SimulatedPlayer无法传入，故使用兼容代码
        if (identity instanceof Gametest.SimulatedPlayer){
            Objective.playerCommand(this, "set", identity, score);
            return;
        }
        
        this.vanillaObjective.setScore(identity, score);
    }
    
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param score - 要增加的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    addScore(one: EntryValueType, score: number){
        checkScoreIsInRange(score);

        score = (this.getScore(one) ?? 0) + score;
        //取32位整数
        score = score >> 0;
        
        this.setScore(one, score);
    }
    
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    removeScore(one: EntryValueType, score: number){
        checkScoreIsInRange(score);
        this.addScore(one, -score);
    }
    
    /**
     * 为分数持有者在记分项上设置一个随机的分数。随机分数使用 {@link Math.random} 生成。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @returns {number} 随机得到的新分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    randomScore(one: EntryValueType, min: number = -2147483647, max: number = 2147483647): number {
        checkScoreIsInRange(min, max);
        let vals = max - min;
        let randomScore = vals * Math.random();
        let result = Math.round(randomScore + min);
        this.setScore(one, result);
        return result;
    }
    
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {EntryValueType} one - 分数持有者。
     */
    resetScore(one: EntryValueType){
        let identity = ScoreboardEntry.getIdentity(one);
        
        //目前Gametest.SimulatedPlayer无法传入，故使用兼容代码
        if (identity instanceof Gametest.SimulatedPlayer){
            Objective.playerCommand(this, "reset", identity);
            return;
        }
        
        if (this.vanillaObjective.hasParticipant(identity))
             this.vanillaObjective.removeParticipant(identity);
    }
    
    /**
     * 重置在记分项上记录的所有分数。
     */
    resetScores(){
        for (const part of this.vanillaObjective.getParticipants()){
            this.vanillaObjective.removeParticipant(part);
        }
    }

    /**
     * 为分数持有者在记分项上执行特定的操作（通过命令）。
     * @param {string} option - 操作类型。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {...any} args - 操作所需要的参数。
     * @throws 未知的命令错误。
     * @throws 若尝试为虚拟玩家设置分数，且世界中有相同名字的玩家时，抛出 `NameConflictError`。
     */
    static playerCommand(objective: Objective, option: string, one: EntryValueType, ...args: any[]){
        let { entity, name, type } = Objective.findCommandRequirement(one);
        
        if (type === EntryType.PLAYER || type === EntryType.ENTITY){
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, "@s", objective.#id);
            let result = Command.execute(entity as EntityValue, Command.getCommand(cmd, ...args));
            
            if (result.statusCode === StatusCode.success
            && (result.successCount ?? 0) > 0){
                return true;
            }
            objective.checkUnregistered();
           //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
            throw new Error(`Could not ${option} score, `
                + "maybe entity or player disappeared?"
                + "\n  cause by: "
                + result.statusMessage);
        } else if (name){
            if (EntityUtils.getWorldVanillaPlayers({name}).length !== 0)
                throw new NameConflictError(name as string);
                
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, name, objective.#id);
            let result = Command.run(Command.getCommand(cmd, ...args));
            if (result.statusCode === StatusCode.success
            && (result.successCount ?? 0) > 0){
                return true;
            }
            objective.checkUnregistered();
            //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
            throw new Error(`Could not ${option} score, `
                + "maybe entity or player disappeared?"
                + "\n  cause by: "
                + result.statusMessage);
        } else {
            throw new Error("unknown error");
        }
    }
    /**
     * 寻找用于在记分项上执行特定的操作的与分数持有者有关的信息。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     */
    static findCommandRequirement(one: EntryValueType): {
        name?: string,
        type: EntryType,
        entity?: EntityValue,
        scbid?: Minecraft.ScoreboardIdentity,
        entry?: ScoreboardEntry
    }{
        let name: string | undefined = undefined;
        let type: EntryType | Minecraft.ScoreboardIdentityType;
        let entity: EntityValue | undefined = undefined;
        let scbid = (one instanceof Minecraft.ScoreboardIdentity) ? one : undefined;
        let entry = (one instanceof ScoreboardEntry) ? one : undefined;
        
        if (scbid != null || entry != null){
            one = one as (Minecraft.ScoreboardIdentity | ScoreboardEntry)
            type = one.type;
            if (type === EntryType.ENTITY || type === EntryType.PLAYER){
                try {
                    entity = one.getEntity();
                } catch {
                }
                if (entity == null)
                    throw new Error("Could not find the entity");
            } else {
                name = one.displayName;
                type = EntryType.FAKE_PLAYER;
            }
        } else if (EntityUtils.isEntity(one)){
            if (EntityUtils.entityIsPlayer(one))
                type = EntryType.PLAYER;
            else
                type = EntryType.ENTITY;
            entity = one;
        } else if (typeof one === "string"){
            type = EntryType.FAKE_PLAYER;
            name = one;
        } else {
            throw new UnknownEntryError();
        }
        
        return { type, entity, name, scbid, entry };
    }
}

export { Objective, ScoreInfo };
