import { ScoreboardIdentity as VanillaScoreboardIdentity } from "mojang-minecraft";
import EntryType from "scripts/yoni/scoreboard/EntryType.js";

export default class Entry {
    #type;
    get type(){
        return this.#type;
    }
    #id;
    get id(){
        if (this.#id == null){
            try {
                this.#id = this.#entity.scoreboard.id;
            } catch {
                throw new Error("Could not init id from vanilla entity, maybe this is null Entry (without link any player), or entity's scoreboard didn't init yet");
            }
        }
        return this.#id;
    }
    #entity;
    getEntity(){
        return this.#entity;
    }
    #displayName;
    get displayName(){
        if (this.#type == EntryType.PLAYER){
            return this.getEntity().name;
        }
        return this.#displayName;
    }
    constructor(id, type, displayName, entity){
        if (id instanceof VanillaScoreboardIdentity){
            let vanillaScbId = id;
            try {
                entity = vanillaScbId.getEntity();
            } catch {
                entity = null;
            }
            displayName = vanillaScbId.displayName;
            type = vanillaScbId.type;
            id = vanillaScbId.id;
        }
        if (type == EntryType.ENTITY){
            displayName = id;
        }
        this.#type = type;
        this.#entity = entity;
        this.#id = id;
        this.#displayName = displayName;
    } 
}
