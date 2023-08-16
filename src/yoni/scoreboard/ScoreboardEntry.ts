import Minecraft from "../minecraft.js";
import { EntryType, EntryValueType } from "./EntryType.js";
import { EntityBase } from "../entity/EntityBase.js";
import { YoniEntity } from "../entity/Entity.js";
import { EntityValue } from "../entity/EntityTypeDefs.js";
import { UnknownEntryError } from "./ScoreboardError.js";

/**
 * 代表一个可以在记分板上持有分数的分数持有者。
 * 
 * 对于运行时的实体与玩家，这个对象是唯一的。
 * 
 * 对于虚拟玩家，不能保证对应的对象的唯一性。
 */
export class ScoreboardEntry {
    static #entityMap = new WeakMap<Minecraft.Entity, ScoreboardEntry>;
    static #playerMap = new WeakMap<Minecraft.Player, ScoreboardEntry>;
    static #scbidMap = new WeakMap<Minecraft.ScoreboardIdentity, ScoreboardEntry>;
    
    /**
     * 寻找指定对象在记分板上使用的分数持有者对象。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {Entry} 与 `one` 对应的分数持有者对象。
     * @throws 若未能根据值得到可能的分数持有者对象，抛出 `UnknownEntryError`。
     */
    static guessEntry(one: EntryValueType): ScoreboardEntry {
        if (one instanceof ScoreboardEntry)
            return one;
        else if (one instanceof Minecraft.ScoreboardIdentity)
            return ScoreboardEntry.getEntry(one.type as unknown as EntryType, one);
        else if (EntityBase.isEntity(one))
            if (EntityBase.entityIsPlayer(one))
                return ScoreboardEntry.getEntry(EntryType.PLAYER, EntityBase.getMinecraftEntity(one));
            else
                return ScoreboardEntry.getEntry(EntryType.ENTITY, EntityBase.getMinecraftEntity(one));
        else if (typeof one === "string")
            return ScoreboardEntry.getEntry(EntryType.FAKE_PLAYER, one);
        throw new UnknownEntryError();
    }
    static getEntry(type: EntryType, identify: Minecraft.ScoreboardIdentity | string | Minecraft.Entity){
        let entry: ScoreboardEntry | null | undefined = null;
        
        if (type === EntryType.ENTITY){
            entry = ScoreboardEntry.#entityMap.get(identify as Minecraft.Entity);
        } else if (type === EntryType.PLAYER){
            entry = ScoreboardEntry.#playerMap.get(identify as Minecraft.Player);
        }
        
        if (!entry && (identify instanceof Minecraft.ScoreboardIdentity) && ScoreboardEntry.#scbidMap.has(identify)){
            entry = ScoreboardEntry.#scbidMap.get(identify);
        }
        
        if (entry)
            return entry;
        
        entry = new ScoreboardEntry(type, identify);
        
        if (identify instanceof Minecraft.ScoreboardIdentity){
            ScoreboardEntry.#scbidMap.set(identify as Minecraft.ScoreboardIdentity, entry);
        } else if (type === EntryType.FAKE_PLAYER){
            // nothing to do
        } else if (type === EntryType.ENTITY){
            ScoreboardEntry.#entityMap.set(identify as Minecraft.Entity, entry);
        } else if (type === EntryType.PLAYER){
            ScoreboardEntry.#playerMap.set(identify as Minecraft.Player, entry);
        } else {
            throw new TypeError("unknown entry type");
        }
        
        return entry;
    }
    
    #entity?: Minecraft.Entity;
    #name?: string;
    #vanillaScbid?: Minecraft.ScoreboardIdentity;
    #id?: number;
    
    private constructor(type: EntryType, identify: Minecraft.ScoreboardIdentity | string | Minecraft.Entity){
        
        if (identify instanceof Minecraft.ScoreboardIdentity){
            this.#vanillaScbid = identify;
            type = identify.type as unknown as EntryType;
            Object.defineProperty(this, "type", { configurable: false, writable: false, value: type });
        } else if (type === EntryType.FAKE_PLAYER
        && typeof identify === "string"){
            this.#name = identify;
            Object.defineProperty(this, "type", { configurable: false, writable: false, value: type });
        } else if (type === EntryType.ENTITY){
            this.#entity = EntityBase.getMinecraftEntity(identify as EntityValue);
            Object.defineProperty(this, "type", { configurable: false, writable: false, value: type });
        } else if (type === EntryType.PLAYER){
            this.#entity = EntityBase.getMinecraftEntity(identify as EntityValue);
            if (!EntityBase.entityIsPlayer(this.#entity)){
                throw new TypeError("not a player");
            }
            Object.defineProperty(this, "type", { configurable: false, writable: false, value: type });
        } else {
            throw new TypeError("not an identify");
        }
    }
    //@ts-ignore
    readonly "type": EntryType;
    get id(): number {
        if (this.vanillaScoreboardIdentity)
            return this.vanillaScoreboardIdentity.id;
            
        throw new ReferenceError("could not find the id of the entry");
    }
    get displayName(): string {
        if (this.type === EntryType.FAKE_PLAYER)
            return this.#name as string;
        else if (this.vanillaScoreboardIdentity !== undefined)
            return this.vanillaScoreboardIdentity.displayName;
        else if (this.type === EntryType.ENTITY)
            return (this.#entity as Minecraft.Entity).id;
        else if (this.type === EntryType.PLAYER)
            return (this.#entity as Minecraft.Player).name;
        else
            throw new TypeError("unknown displayName");
    }
    getEntity(): YoniEntity {
        if (this.type !== EntryType.FAKE_PLAYER){
            if (this.#vanillaScbid && (!this.#entity || !EntityBase.isAliveEntity(this.#entity))){
                this.#entity = this.#vanillaScbid.getEntity();
            }
            if (this.#entity)
                return EntityBase.getAliveEntity(this.#entity);
        }
        throw new ReferenceError("this ScoreboardIdentity didn't relate to an alive entity");
    }
    getVanillaEntity(): Minecraft.Entity {
        if (this.type !== EntryType.FAKE_PLAYER){
            if (this.#vanillaScbid && (!this.#entity || !EntityBase.isAliveEntity(this.#entity))){
                this.#entity = this.#vanillaScbid.getEntity();
            }
            if (this.#entity)
                return EntityBase.getAliveVanillaEntity(this.#entity);
        }
        throw new ReferenceError("this ScoreboardIdentity didn't relate to an alive entity");
    }
    getIdentity(): Minecraft.ScoreboardIdentity | string | Minecraft.Entity {
        if (this.type === EntryType.FAKE_PLAYER)
            return this.#name as string;
        else if (this.vanillaScoreboardIdentity !== undefined)
            return this.vanillaScoreboardIdentity;
        else if (this.type === EntryType.ENTITY || this.type === EntryType.PLAYER)
            return this.getVanillaEntity();
        else
            throw new ReferenceError("failed to get an available identity");
    }
    get vanillaScoreboardIdentity(): Minecraft.ScoreboardIdentity | undefined {
        if (this.#entity && (this.type === EntryType.ENTITY || this.type === EntryType.PLAYER)
        && (this.#vanillaScbid ?? undefined) !== (this.#entity?.scoreboardIdentity ?? undefined)){
            this.#vanillaScbid = this.#entity?.scoreboardIdentity ?? undefined;
            if (this.#vanillaScbid){
                ScoreboardEntry.#scbidMap.set(this.#vanillaScbid, this);
            }
        }
        return this.#vanillaScbid;
    } 
}
