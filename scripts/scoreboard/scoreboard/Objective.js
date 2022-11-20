import { Minecraft, VanillaWorld, overworld, StatusCode, VanillaScoreboard } from "../basis.js";

import { Command } from "../command.js";
import { Entry, EntryType } from "./Entry.js";
import { NameConflictError, ScoreRangeError, ObjectiveUnregisteredError } from "./ScoreboardError.js"

/**
 * Contains objectives and participants for the scoreboard.
 */
class Objective {
    #scoreboard;
    #objectiveOptions;
    #id;
    #criteria;
    #displayName;
    #unregistered = false;
    #vanillaObjective;
    
    /**
     * Identifier of the scoreboard objective.
     * @throws This property can throw when used.
     */
    get id(){
        return this.#id;
    }
    
    /**
     * Returns the criteria of the objective
     * @throws This property can throw when used.
     */
    get criteria(){
        return this.#criteria;
    }
    
    /**
     * Returns the player-visible name of this scoreboard
     * objective.
     * @throws This property can throw when used.
     */
    get displayName(){
        return this.#displayName;
    }
    
    /** 
     * @returns {boolean} whether the objective is readonly, notice that readonly doesn't implemented yet.
     */
    isReadOnly(){
        this.checkUnregistered();
        return !!this.#objectiveOptions?.readonly;
    }
    
    /**  
     * @returns {boolean}  Returns whether the objective has been removed.
     */
    isUnregistered(){
        if (!this.#unregistered){
            let currentVanillaObjective = VanillaScoreboard.getObjective(this.#id);
            if (currentVanillaObjective === undefined || currentVanillaObjective !== this.#vanillaObjective && currentVanillaObjective !== this.#vanillaObjective?.vanillaObjective){
                this.#unregistered = true;
            }
        }
        return this.#unregistered;
    }

    /**
     * Returns whether the objective has been removed.
     * @throws Throw when the objective has been removed.
     */
    checkUnregistered(){
        if (this.isUnregistered())
            throw new ObjectiveUnregisteredError(this.#id);
    }
    
    /**
     * @returns {Minecraft.ScoreboardObjective} the origin objective class of this scoreboard
     * objective.
     */
    get vanillaObjective(){
        return this.#vanillaObjective;
    }
    
    /**
     * @remarks
     * Remove this objective
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
     * add score in the objective for the entry
     * @param {Entry|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     */
    async postAddScore(entry, score){
        if (!Number.isInteger(score))
            throw new ScoreRangeError();
        if (!await this.#postPlayersCommand("add", entry, score)){
            throw new InternalError("Could not add score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * set a random score for entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} min 
     * @param {number} max 
     * @returns {number} the new score of the entry
     */
    async postRandomScore(entry, min=-2147483648, max=2147483647){
        if (!Number.isInteger(min) || !Number.isInteger(max))
            throw new ScoreRangeError();
        if (!await this.#postPlayersCommand("random", entry, min, max)){
            throw new InternalError("Could not random score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * remove score in the objective for the entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     */
    async postRemoveScore(entry, score){
        if (!Number.isInteger(score))
            throw new ScoreRangeError();
        if (await this.#postPlayersCommand("remove", entry, score) === false){
            throw new InternalError("Could not remove score, maybe entity or player disappeared?");
        }
        return this.getScore(entry);
    }
    
    /**
     * reset score in the objective for the entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     */
    async postResetScore(entry){
        if (await this.#postPlayersCommand("reset", entry) === false){
            throw new InternalError("Could not reset score, maybe entity or player disappeared?");
        }
    }
    
    /**
     * reset all score for entrys in the objective
     */
    async postResetScores(){
        let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "scoreboard", "players", "reset", "*", this.#id);
        if (!rt.statusCode){
            throw new Error(rt.statusMessage);
        }
    }
    
    /**
     * @remarks
     * Set a specific score for a participant.
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     * @throws This function can throw errors.
     */
    async postSetScore(entry, score){
        if (!Number.isInteger(score))
            throw new ScoreRangeError();
        if (!await this.#postPlayersCommand("set", entry, score)){
            throw new InternalError("Could not set score, maybe entity or player disappeared?");
        }
        return score;
    }
    
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
            return !(await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, ...params)).statusCode;
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let params = ["scoreboard", "players", option, entry.displayName, this.#id, ...args];
            return !(await Command.addParams(Command.PRIORITY_HIGHEST, ...params)).statusCode;
        } else {
            throw new NameConflictError(entry.displayName);
        }
        
    }
    
    /**
     * @remarks
     * Returns a specific score for a participant, else return undefined
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} participant
     * @returns {number} - the score of entry
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
     * @returns {Entry[]} - all objective participant identities.
     * @throws This function can throw errors.
     */
    getEntries(){
        this.checkUnregistered();
        
        return Array.from(this.vanillaObjective.getParticipants())
            .map((_) => {
                return Entry.getEntry({scbid: _, type: _.type});
            });
    }
    
    /**
     * @returns {ScoreInfo[]} specific scores for this objective for all
     * participants.
     * @throws This function can throw errors.
     */
    getScoreInfos(){
        this.checkUnregistered();
        
        return Array.from(this.getEntries())
            .map((_)=>{
                return this.getScoreInfo(_)
            });
    }
    
    /**
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry
     * @param {boolean} - should we set score to 0 if score is undefined
     * @returns {ScoreInfo} specific score for this objective for a
     * participants.
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
     * @remarks
     * Set a specific score for a participant.
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     * @throws This function can throw errors.
     */
    async setScore(...args){
        return this.postSetScore(...args);
    }
    /**
     * remove score in the objective for the entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     */
    async removeScore(...args){
        return this.postRemoveScore(...args);
    }
    /**
     * set a random score for entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} min 
     * @param {number} max 
     * @returns {number} the new score of the entry
     */
    async randomScore(...args){
        return this.postRandomScore(...args);
    }
    /**
     * reset score in the objective for the entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     */
    async resetScore(...args){
        return this.postResetScore(...args);
    }
    /**
     * add score in the objective for the entry
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     * @param {number} score 
     * @returns {number} the new score of the entry
     */
    async addScore(...args){
        return this.postAddScore(...args);
    }
}

class ScoreInfo {
    #entry;
    #objective;
    
    /**
     * @param {Objective}
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
    
    set score(score){
        this.#objective.setScore(this.#entry, score);
    }
    
    /**
     * @returns {number} score
     */
    get score(){
        return this.#objective.getScore(this.#entry);
    }
    
    reset(){
        this.#objective.resetScore(this.#entry);
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
