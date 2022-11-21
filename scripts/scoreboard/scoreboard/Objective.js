import { Minecraft, VanillaWorld, StatusCode, VanillaScoreboard } from "../basis.js";

import { Command } from "../command.js";
import { Entry, EntryType } from "./Entry.js";
import { NameConflictError, ScoreRangeError, ObjectiveUnregisteredError } from "./ScoreboardError.js"

//实际运行并不需要，只是为了自动补全生效而导入的
import { YoniEntity } from "../entity.js";

/**
 * check whether numbers is in range from -2^31 to 2^31-1
 * @param  {...number} scores 
 * @throws Throws when one of number not in range
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
 * 包含记分板的目标（记分项）和参与者（记分对象）。
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
     * @throws This property can throw when used.
     */
    get id(){
        return this.#id;
    }
    
    /**
     * 记分项的准则
     * @throws This property can throw when used.
     */
    get criteria(){
        return this.#criteria;
    }
    
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     * @throws This property can throw when used.
     */
    get displayName(){
        return this.#displayName;
    }
    
    /** 
     * @remarks 此记分项对象是否只允许使用getScore()
     * @remarks （此功能未实现）
     * @returns {boolean} 表示是否此记分项对象只允许使用getScore()
     */
    isReadOnly(){
        this.checkUnregistered();
        return !!this.#objectiveOptions?.readonly;
    }
    
    /**
     * @remarks 检测此对象对应的记分项是否已经被移除
     * @returns {boolean} 此对象对应的记分项是否已经被移除。
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
     * @remarks 检查此对象对应的记分项是否被移除
     * @throws 当此对象对应的记分项被移除时抛出错误
     */
    checkUnregistered(){
        if (this.isUnregistered())
            throw new ObjectiveUnregisteredError(this.#id);
    }
    
    /**
     * 原始记分项对象
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象
     */
    get vanillaObjective(){
        return this.#vanillaObjective;
    }
    
    /**
     * 将此对象对应的记分项从记分板上移除
     * @throws This function can throw error when objective has been unregistered.
     */
    unregister(){
        this.checkUnregistered();
        
        VanillaScoreboard.removeObjective(this.#id);
    }
    
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
     * @remarks 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async postAddScore(entry, score){
        checkScoreIsInRange(score);
        if (!await this.#postPlayersCommand("add", entry, score)){
            throw new InternalError("Could not add score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * @remarks 为记分板项目在记分项上设置一个随机的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} min - 随机分数的最小值
     * @param {number} max - 随机分数的最大值
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async postRandomScore(entry, min=-2147483648, max=2147483647){
        checkScoreIsInRange(min, max);
        if (!await this.#postPlayersCommand("random", entry, min, max)){
            throw new InternalError("Could not random score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * @remarks 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async postRemoveScore(entry, score){
        checkScoreIsInRange(score);
        if (!await this.#postPlayersCommand("remove", entry, score)){
            throw new InternalError("Could not remove score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * @remarks 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     */
    async postResetScore(entry){
        if (!await this.#postPlayersCommand("reset", entry)){
            throw new InternalError("Could not reset score, maybe entity or player disappeared?");
        }
    }
    
    /**
     * @remarks 重置所有在记分项上的记分板项目的分数
     */
    async postResetScores(){
        let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "scoreboard", "players", "reset", "*", this.#id);
        if (rt.statusCode !== StatusCode.success){
            throw new Error(rt.statusMessage);
        }
    }
    
    /**
     * @remarks 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     */
    async postSetScore(entry, score){
        checkScoreIsInRange(score);
        if (!await this.#postPlayersCommand("set", entry, score)){
            throw new InternalError("Could not set score, maybe entity or player disappeared?");
        }
        return score;
    }
    
    /**
     * @remarks 为记分板项目在记分项上执行特定的操作
     * @param {string} option - 操作的名称
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {...any} args - 操作所需要的参数
     * @returns {Promise<boolean>} 操作是否成功
     * @throws This function can throw errors.
     */
    async #postPlayersCommand(option, entry, ...args){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let params = ["scoreboard", "players", option, "@s", this.#id, ...args];
            let ent = entry.getEntity();
            if (ent === undefined){
                throw new InternalError("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, ...params);
            return rt.statusCode === StatusCode.success;
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let params = ["scoreboard", "players", option, entry.displayName, this.#id, ...args];
            let rt = await Command.addParams(Command.PRIORITY_HIGHEST, ...params);
            return rt.statusCode === StatusCode.success;
        } else {
            throw new NameConflictError(entry.displayName);
        }
        
    }
    
    /**
     * @remarks 获取记分板项目在记分项上的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @returns {number} 记分板项目的分数
     * @throws This function can throw errors.
     */
    getScore(entry){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        } catch {
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            } catch { return undefined; }
        }
    }
    
    /**
     * @remarks 获取在记分项上的记分板项目
     * @returns {Entry[]} 一个包含了在记分项上的记分板项目的数组
     * @throws This function can throw errors.
     */
    getEntries(){
        this.checkUnregistered();
        
        return Array
        .from(this.vanillaObjective.getParticipants())
        .map((scbid) => Entry.getEntry({scbid, type: scbid.type}) );
    }
    
    /**
     * @remarks 获取表示了在记分项上的记分板项目的分数的对象
     * @returns {ScoreInfo[]} 一个数组，包含了所有表示了在记分项上的记分板项目的分数的对象
     * @throws This function can throw errors.
     */
    getScoreInfos(){
        this.checkUnregistered();
        
        return Array.from(this.getEntries())
            .map((_)=>{
                return this.getScoreInfo(_);
            });
    }
    
    /**
     * @remarks 获取一个可以代表一个记分板项目在此记分项上的分数的对象
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {boolean} autoInit - 如果为true，且指定的记分板项目在此记分项上的分数未定义，将会设置它的分数为0
     * @returns {ScoreInfo}
     * @throws This function can throw errors.
     */
    getScoreInfo(entry, autoInit=false){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);

        let scoreInfo = new ScoreInfo(this, entry);
        if (autoInit == true && scoreInfo.score == null)
            scoreInfo.score = 0;
        return scoreInfo;
    }
    
    //以下为兼容函数，主要是不这样做要改的东西比较多
    
    /**
     * @remarks 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     */
    async setScore(entry, score){
        return this.postSetScore(entry, score);
    }
    /**
     * @remarks 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async removeScore(entry, score){
        return this.postRemoveScore(entry, score);
    }
    /**
     * @remarks 为记分板项目在记分项上设置一个随机的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} min - 随机分数的最小值
     * @param {number} max - 随机分数的最大值
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async randomScore(entry, min=-2147483648, max=2147483647){
        return this.postRandomScore(entry, min, max);
    }
    /**
     * @remarks 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     */
    async resetScore(entry){
        return this.postResetScore(entry);
    }
    /**
     * @remarks 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async addScore(entry, score){
        return this.postAddScore(entry, score);
    }
}

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
     */
    get score(){
        return this.#objective.getScore(this.#entry);
    }
    
    /**
     * 重置此对象对应的记分板项目在对应的记分项上的分数
     */
    async reset(){
        awaitthis.#objective.resetScore(this.#entry);
    }
    
    getEntry(){
        return this.#entry;
    }
    
    getObjective(){
        return this.#objective;
    }
    
    toString(){
        return String(this.score);
    }
    
}

export { Objective, ScoreInfo };
export default Objective;
