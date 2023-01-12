import { VanillaScoreboard, Minecraft, Gametest } from "../basis.js";
import { YoniEntity } from "../entity.js";
import { UnknownEntryError } from "./ScoreboardError.js";
import { useOptionalFasterCode } from "../config.js";

let idRecords = new Map();
let nameRecords = new Map();
let entityRecords = new WeakMap();
let scbidRecords = new WeakMap();

/** @enum */
const EntryType = {
    PLAYER: Minecraft.ScoreboardIdentityType.player,
    ENTITY: Minecraft.ScoreboardIdentityType.entity,
    FAKE_PLAYER: Minecraft.ScoreboardIdentityType.fakePlayer
}

/**
 * @interface
 * @typedef EntryOption
 * @property {string} [name]
 * @property {number} [id]
 * @property {Minecraft.ScoreboardIdentity} [scbid]
 * @property {YoniEntity|Minecraft.Entity|Minecraft.Player} [entity]
 * @property {EntryType} [type]
 */

/**
 * Contains an identity of the scoreboard item.
 */
class Entry {
    
    /**
     * 从可能为分数持有者的值获取其对象。
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} any - 可能为分数持有者的值
     * @returns {Entry} 与 `any` 对应的分数持有者对象。
     * @throws 若未能根据值得到可能的分数持有者对象，抛出 `UnknownEntryError`。
     */
    static guessEntry(any){
        if (any instanceof Minecraft.ScoreboardIdentity)
            return this.getEntry({scbid: any});
        if (any instanceof YoniEntity || any instanceof Minecraft.Entity || any instanceof Minecraft.Player)
            return this.getEntry({entity: any});
        if (typeof any === "string")
            return this.getEntry({name: any, type: EntryType.FAKE_PLAYER});
        if (!isNaN(Number(any)))
            return this.getEntry({id: any});
        throw new UnknownEntryError();
    }
    
    /**
     * 根据 `option` 接口获得分数持有者对象。
     * @param {EntryOption} option
     * @returns {Entry}
     */
    static getEntry(option){
        
        let { entity, id, name, scbid, type } = option;
        entity = (entity instanceof YoniEntity) ? entity.vanillaEntity : entity;
        let entry;
        
        if (type === EntryType.FAKE_PLAYER && scbid !== undefined)
            name = scbid.displayName;
            
        //优先级: entity, scbid, id, name
        if (type !== EntryType.FAKE_PLAYER && entityRecords.has(entity))
            entry = entityRecords.get(entity);
        else if (type === EntryType.FAKE_PLAYER && nameRecords.has(name))
            entry = nameRecords.get(name);
        else if (scbidRecords.has(scbid))
            entry = scbidRecords.get(scbid);
        else if (idRecords.has(id))
            entry = idRecords.get(id);
        else
            entry = new Entry(option);
        
        if (type != null && entry.type !== type)
            throw new Error("entry type do not matches");
            
        if (type !== EntryType.FAKE_PLAYER && entry.getVanillaEntity() != null)
            entityRecords.set(entry.getVanillaEntity(), entry);
        if (entry.id !== undefined)
            idRecords.set(entry.id, entry);
        if (entry.vanillaScbid !== undefined)
            scbidRecords.set(entry.vanillaScbid, entry);
        if (type === EntryType.FAKE_PLAYER && entry.displayName !== undefined)
            nameRecords.set(entry.displayName, entry);
        
        return entry;
    }
    
    /**
     * 根据 `option` 获得原始分数持有者对象（需要启用 `useOptionalFasterCode`）。
     * @function getVanillaScoreboardParticipant
     * @param {EntryOption} option
     * @returns {Minecraft.ScoreboardIdentity}
     */
    static getVanillaScoreboardParticipant(){
        throw new Error("To use this function, you have to enable 'useOptionalFasterCode' in the config");
    }
    
    #type;
    #id;
    #name;
    #vanillaScbid;
    #entity;
    
    /**
     * 分数持有者的类型
     * @returns {EntryType}
     */
    get type(){
        return this.#type;
    }
    
    /**
     * 分数持有者的标识符
     * @returns {number}
     */
    get id(){
        if (this.vanillaScbid?.id !== this.#id)
            this.#id = this.vanillaScbid?.id;
        return this.#id;
    }
    
    /**
     * 一个“玩家可见的”名称
     * @returns {string}
     */
    get displayName(){
        if (this.vanillaScbid !== undefined && this.#vanillaScbid.displayName !== undefined)
            return this.vanillaScbid.displayName;
        if (this.#type == EntryType.PLAYER)
            return this.#entity.name;
        if (this.#type  == EntryType.ENTITY)
            return this.id;
        if (this.#type === EntryType.FAKE_PLAYER)
            return this.#name;
        
    }
    
    /**
     * 原始分数持有者对象，可能为空。
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid(){
        if ((this.#type === EntryType.PLAYER || this.#type === EntryType.ENTITY)
        && this.#entity.scoreboard !== this.#vanillaScbid)
            this.#vanillaScbid = this.#entity.scoreboard;
        if (this.#vanillaScbid !== undefined && scbidRecords.get(this.#vanillaScbid) !== this)
            scbidRecords.set(this.#vanillaScbid, this);
        return this.#vanillaScbid;
    }
    
    /**
     * 如果此分数持有者不是虚拟玩家，返回此分数持有者对应实体的对象。
     * @returns {YoniEntity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity(){
        return YoniEntity.from(this.getVanillaEntity());
    }
    
    /**
     * If the scoreboard identity is an entity or player, returns 
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     */
    getVanillaEntity(){
        if (this.#type === EntryType.FAKE_PLAYER)
            this.#entity = null;
        else if (this.#entity === null)
            this.#entity = this.vanillaScbid.getEntity();
        return this.#entity;
    }
    
    /**
     * 更新此分数持有者对象与原始分数持有者对象的映射关系。
     * @returns {Entry} 更新完成后，返回对象自身。
     */
    update(){
        if (this.#type === EntryType.FAKE_PLAYER){
            this.#vanillaScbid = undefined;
            for (let s of VanillaScoreboard.getParticipants()){
                if (s.displayName === this.#name && s.type === this.#type){
                    this.#vanillaScbid = s;
                    break;
                }
            }
        } else {
            //使用getter重新初始化变量
            let i = this.vanillaScbid;
        }
        return this;
    }
    
    /**
     * @hideconstructor
     */
    constructor(option){
        let { entity, name, id, scbid, type } = option;
        //处理时使用原版实体对象
        entity = (entity instanceof YoniEntity) ? entity.vanillaEntity : entity;
        
        if (entity !== undefined){
            if (entity instanceof Minecraft.Player || entity instanceof Gametest.SimulatedPlayer)
                type = EntryType.PLAYER;
            else if (entity instanceof Minecraft.Entity)
                type = EntryType.ENTITY;
            else throw new TypeError("Unknown entity type");
            scbid = entity.scoreboard;
            id = scbid?.id;
        } else {
            if (useOptionalFasterCode){
                scbid = Entry.getVanillaScoreboardParticipant(option);
            } else {
                let condF = null;
                if (type === EntryType.FAKE_PLAYER && name !== "" && name !== scbid?.displayName){
                    condF = (scbid) => {
                        return (scbid.displayName === name && type === scbid.type);
                    }
                } else if (id !== undefined && scbid === undefined){
                    condF = (scbid) => {
                        return scbid.id === id;
                    }
                }
                if (condF !== null){
                    scbid = undefined;
                    for (let s of VanillaScoreboard.getParticipants()){
                        if (condF(s)){
                            scbid = s;
                            break;
                        }
                    }
                }
            }
            if (scbid !== undefined){
                type = scbid.type;
                name = scbid.displayName;
                id = scbid.id;
                if (type !== EntryType.FAKE_PLAYER){
                    entity = null;
                    try {
                        entity = scbid.getEntity();
                    } catch {
                        entity = null;
                    }
                }
            } else if (id !== undefined){
                throw new Error(`Unable to determine the scbid ${id}`);
            }
        }
        
        this.#id = id;
        this.#entity = entity;
        this.#name = name;
        this.#type = type;
        this.#vanillaScbid = scbid;
        
    }
}

export { Entry, EntryType };
export default Entry;

if (useOptionalFasterCode){
//缓存分数持有者映射
import("../schedule.js")
.then(m => m.YoniScheduler)
.then((YoniScheduler) => {
    YoniScheduler.runCycleTickTask(async ()=>{
        for (let scbid of VanillaScoreboard.getParticipants()){
            Entry.getEntry({ scbid: scbid, id: scbid.id, type: scbid.type }); //to cache entry result
            await 1; //pause async function
        }
    }, 5, 10, true); //5t后，开始每10t运行一次任务，异步
});

//使用getVanillaScoreboardParticipant获取scbid
(function (){
    let cacheTimeout = 500;
    
    let parts;
    let lastCacheTime = -1;
    
    let entityRecords;
    let idRecords;
    let nameRecords;
    
    const updateCache = () => {
    
        entityRecords = new WeakMap();
        idRecords = new Map();
        nameRecords = new Map();
        
        lastCacheTime = Date.now();
        parts = VanillaScoreboard.getParticipants();
        
        for (let part of parts){
            idRecords.set(part.id, part);
            if (part.type !== EntryType.FAKE_PLAYER){
                try {
                    entityRecords.set(part.getEntity(), part);
                } catch {
                }
            } else {
                nameRecords.set(part.displayName, part);
            }
        }
    };
    
    Entry.getVanillaScoreboardParticipant = function getVanillaScoreboardParticipant(option){
        if (Date.now() - lastCacheTime > cacheTimeout){
            updateCache();
        }
        
        let { type, entity, id, name, scbid } = option;
        entity = (entity instanceof YoniEntity) ? entity.vanillaEntity : entity;
        
        if (scbid instanceof Minecraft.ScoreboardIdentity) return scbid;
        
        //entity not null, type not fakeplayer
        if (entity && (type && type !== EntryType.FAKE_PLAYER || !type)){
            scbid = entityRecords.get(entity);
        }
        
        //name not null, scbid is null, type is faleplayer or null
        if (!scbid && name && (type && type === EntryType.FAKE_PLAYER || !type)){
            scbid = nameRecords.get(name);
        }
        
        
        //name not null, scbid is null, type is null
        if (!scbid && id != null){
            scbid = idRecords.get(name);
            if (type && scbid.type !== type)
                scbid = null;
        }
        
        return scbid;
    }
})();

}