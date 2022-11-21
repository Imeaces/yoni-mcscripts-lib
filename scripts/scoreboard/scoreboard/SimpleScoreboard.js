import { StatusCode, VanillaScoreboard, Minecraft } from "../basis.js";
import { Command } from "../command.js";

import Objective from "./Objective.js";
import Entry from "./Entry.js";

//实际运行并不需要，只是为了自动补全生效而导入的
import { YoniEntity } from "../entity.js";

/**
 * enum of alive display slot
 */
export const DisplaySlotType = {
    list: "list",
    sidebar: "sidebar",
    belowname: "belowname"
}

/**
 * Contains objectives and participants for the scoreboard.
 */
export default class SimpleScoreboard {
    /**
     * @type {Map<string, Objective>}
     */
    static #objectives = new Map();
    
    /**
     * @remarks Adds a new objective to the scoreboard.
     * @param {string} name - name of new objective
     * @param {string} criteria="dummy" - criteria of new objective, current only accept "dummy"
     * @param {string} displayName=name - displayName of new
     * objective, default is equals to name
     * @returns {Objective} new objective
     * @throws This function can throw errors.
     */
    static addObjective(name, criteria="dummy", displayName=name){
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        if (this.getObjective(name) !== undefined)
            throw new Error("Objective "+name+" existed!");
        if (criteria !== "dummy")
            throw new Error("Unsupported criteria: " + criteria);
        if (!name || typeof name !== "string")
            throw new TypeError("Objective display name not valid!");
        
        let vanillaObjective = VanillaScoreboard.addObjective(name, displayName);
        
        let newObjective = new Objective({
            scoreboard: this,
            name, criteria, displayName,
            vanillaObjective
        });
        this.#objectives.set(name, newObjective);
        
        return newObjective;
    }
    
    /**
     * @remarks Removes an objective from the scoreboard.
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - objectiveId or Objective
     */
    static removeObjective(nameOrObjective){
        let objectiveId;
        if (nameOrObjective instanceof Objective || nameOrObjective instanceof Minecraft.ScoreboardObjective){
            objectiveId = nameOrObjective.id;
        } else {
            objectiveId = nameOrObjective;
        }
        if (objectiveId && typeof objectiveId === "string"){
            try { VanillaScoreboard.removeObjective(objectiveId); } catch {}
        } else {
            throw new Error("unknown error while removing objective");
        }
        if (this.#objectives.has(objectiveId)){
            let inMapObjective = this.getObjective(objectiveId);
            if (!inMapObjective.isUnregister()){
                inMapObjective.unregister();
            }
            this.#objectives.delete(objectiveId);
        }
    }
    
    /**
     * @remarks
     * Returns a specific objective (by id).
     * @param {string} name - objectiveId
     * @param {boolean} autoCreateDummy=false - if true, it will try to create a dummy objective when objective didn't exist
     * @returns {?Objective} return Objective if existed, else return null
     */
    static getObjective(name, autoCreateDummy=false){
        let result = null;
        let objective = this.#objectives.get(name);
        let vanillaObjective = (()=>{
            let rt = VanillaScoreboard.getObjective(name);
            if (rt == null && autoCreateDummy){
                rt = VanillaScoreboard.addObjective(name, name);
            }
            return rt;
        })();
        if (objective === undefined || objective.isUnregistered()){
            if (vanillaObjective != null){
                result = new Objective(this, name, "dummy", vanillaObjective.displayName, vanillaObjective);
                this.#objectives.set(name, result);
            }
        } else {
            result = objective;
        }
        return result;
    }
    
    /** 
     * @remarks
     * Returns all defined objectives.
     * @returns {Objective[]} an array contains all defined objectives.
     */
    static getObjectives(){
        let objectives = [];
        Array.from(VanillaScoreboard.getObjectives()).forEach((_)=>{
            objectives.push(this.getObjective(_.id));
        });
        return objectives;
    }
    
    /**
     * @ignore
     * @remarks
     * Returns an objective that occupies the specified display
     * slot.
     * @param {string} displaySlotId
     * @return {Objective}
     * @throws This function can throw errors.
     */
    static getDisplayAtSlot(...args){
        let rt = VanillaScoreboard.getObjectiveAtDisplaySlot(...args);
        let result = {
            objective: this.getObjective(rt.objective.id),
        };
        if (sortOrder in rt){
            result.sortOrder = rt.sortOrder;
        }
        return this.getObjective(result.id);
    }
    
    static #getIdOfObjective(any){
         if (any instanceof Objective || any instanceof Minecraft.ScoreboardObjective){
             return any.id
         } else if (any && typeof any === "string"){
             return any;
         } else {
             throw new Error();
         }
    }
    /**
     * @ignore
     * 
     * @param {*} slot 
     * @param {*} settings 
     * @returns 
     */
    static setDisplayAtSlot(slot, settings){
        let objId = this.#getIdOfObjective(settings.objective);
        let rt = VanillaScoreboard.setObjectiveAtDisplaySlot(
            slot,
            new Minecraft.ScoreboardObjectiveDisplayOptions(
                objId,
                settings.sortOrder
            )
        );
        return this.getObjective(rt.id);
    }
    
    /**
     * @ignore
     * @remarks
     * Clears the objective that occupies a display slot.
     * @param displaySlotId
     * @throws TypeError when slot not a DisplaySlot.
     */
    static clearDisplaySlot(slot){
        let rt = VanillaScoreboard.clearObjectiveAtDisplaySlot(slot);
        if (rt?.id !== undefined){
            return this.getObjective(rt.id);
        }
    }
    
    /**
     * @remarks
     * Returns all defined scoreboard identities.
     * @returns {Entry[]}
     */
    static getEntries(){
        return Array.from(VanillaScoreboard.getParticipants())
            .map((_)=>{
                return Entry.getEntry({scbid: _, type: _.type});
            });
    }
    
    /**
     * remove all objectives from scoreboard
     */
    static removeAllObjectives(){
        Array.from(VanillaScoreboard.getObjectives())
            .forEach(obj=>{
                this.removeObjective(obj);
            });
    }
    
    /**
     * @remarks reset scores of all participants (in asynchronously)
     * @param {(entry:Entry) => boolean} filter - particular 
     * filter function, the function will be call for each 
     * participants, if return true, then reset the scores of 
     * participants
     * @return {Promise<number>} success count
     */
    static async postResetAllScore(filter=null){
        if (filter === null){
            let rt = await Command.fetch("scoreboard players reset *");
            if (rt.statusCode){
                throw new Error(rt.statusMessage);
            } else {
                return;
            }
        }
        let resolve;
        let promise = new Promise((re)=>{
            resolve = re;
        });
        let entries = this.getEntries();
        let successCount = 0;
        let doneCount = 0;
        let successCountAdder = ()=>{
            successCount++;
        };
        let resolveIfDone = ()=>{
            if (++doneCount === entries.length){
                resolve(successCount);
            }
        };
        entries.filter(filter).forEach((id)=>{
            this.postResetScore(id)
                .then(successCountAdder)
                .finally(resolveIfDone);
        });
        return promise;
    }
    
    /**
     * reset scores of a participant
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry 
     */
    static async postResetScore(entry){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let ent = entry.getEntity();
            if (ent == null){
                throw new InternalError("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, "scoreboard", "players", "reset", "@s");
            if (rt.statusCode != StatusCode.success){
                throw new InternalError("Could not set score, maybe entity or player disappeared?");
            }
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "scoreboard", "players", "reset", entry.displayName);
            if (rt.statusCode !== StatusCode.success){
                throw new InternalError(rt.statusMessage);
            }
        } else {
            throw new NameConflictError(entry.displayName);
        }
    }
}

export { SimpleScoreboard }
