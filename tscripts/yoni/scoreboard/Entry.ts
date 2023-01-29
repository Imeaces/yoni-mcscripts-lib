// @ts-nocheck
import { VanillaScoreboard, Minecraft, Gametest } from "../basis.js";
import { EntityBase } from "../entity/EntityBase.js";
import { UnknownEntryError } from "./ScoreboardError.js";
import { debug, useOptionalFasterCode, enableScoreboardIdentityByNumberIdQuery } from "../config.js";

/**
 * 理论上，存十万条就很卡了
 * 那个时候，建议还是直接让游戏操控吧
 */

let idRecords;
if (enableScoreboardIdentityByNumberIdQuery){
    idRecords = new Map();
}
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
        if (any instanceof EntityBase || any instanceof Minecraft.Entity || any instanceof Minecraft.Player)
            return this.getEntry({entity: any});
        if (typeof any === "string")
            return this.getEntry({name: any, type: EntryType.FAKE_PLAYER});
        if (!isNaN(Number(any))){
            if (!enableScoreboardIdentityByNumberIdQuery)
                throw new Error("scbid search by number id is disable, set 'enableScoreboardIdentityByNumberIdQuery' to 'true' to enable it");
            return this.getEntry({id: any});
        }
        throw new UnknownEntryError();
    }
    
    /**
     * 根据 `option` 接口获得分数持有者对象。
     * @param {EntryOption} option
     * @returns {Entry}
     */
    static getEntry(option){
        
        let { entity, id, name, scbid, type } = option;
        entity = (entity instanceof EntityBase) ? entity.vanillaEntity : entity;
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
        else if (enableScoreboardIdentityByNumberIdQuery 
        && idRecords.has(id))
            entry = idRecords.get(id);
        else
            entry = new Entry(option);
        
        if (type != null && entry.type !== type)
            throw new Error("entry type do not matches");
            
        if (type !== EntryType.FAKE_PLAYER){
            let entity;
            let canSet = false;
            try {
                entity = entry.getVanillaEntity();
                canSet = true;
            } catch {}
            if (canSet){
                if (entity == null){
                    throw new Error("null entity object");
                }
                entityRecords.set(entity, entry);
            }
        }
        if (enableScoreboardIdentityByNumberIdQuery
        && entry.id !== undefined)
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
        if (this.#type === EntryType.PLAYER)
            return this.#entity.name;
        if (this.#type === EntryType.ENTITY)
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
        && this.#entity && this.#entity.scoreboard !== this.#vanillaScbid)
            this.#vanillaScbid = this.#entity?.scoreboard;
        if (this.#vanillaScbid != null && scbidRecords.get(this.#vanillaScbid) !== this)
            scbidRecords.set(this.#vanillaScbid, this);
        return this.#vanillaScbid;
    }
    
    /**
     * 如果此分数持有者不是虚拟玩家，返回此分数持有者对应实体的对象。
     * @returns {YoniEntity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity(){
        return EntityBase.from(this.getVanillaEntity());
    }
    
    /**
     * If the scoreboard identity is an entity or player, returns 
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     */
    getVanillaEntity(){
        if (this.#type === EntryType.FAKE_PLAYER){
            this.#entity = null;
        } else if (this.#entity === null){
            try {
                this.#entity = this.vanillaScbid.getEntity();
            } catch {
                throw new Error("实体尚未加载或已死亡");
            }
        }
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
        entity = (entity instanceof EntityBase) ? entity.vanillaEntity : entity;
        
        if (entity !== undefined){
            if (entity instanceof Minecraft.Player || entity instanceof Gametest.SimulatedPlayer)
                type = EntryType.PLAYER;
            else if (entity instanceof Minecraft.Entity)
                type = EntryType.ENTITY;
            else throw new TypeError("Unknown entity type");
            scbid = entity.scoreboard;
            id = scbid?.id;
        } else {
            let condF = null;
            if (scbid == null
            && type === EntryType.FAKE_PLAYER
            && name !== ""
            && name != null){
                condF = (scbid) => {
                    return (scbid.displayName === name && type === scbid.type);
                }
            } else if (scbid == null && id !== null){
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
            
            if (scbid != null){
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
            } else if (id != null){
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
        let count = 0;
        for (let scbid of VanillaScoreboard.getParticipants()){
            if (!scbid){
                //scbid为空
                //可能是mojang抽风了
                //不用担心，忽略就行
                //就是可能会报错
                //那个没办法
                //存多了就会这样
                //目前没法解决
                continue;
            }
            await Entry.getEntry({ scbid: scbid, id: scbid.id, type: scbid.type }); //to cache entry result
            count++;
            //pause async function
        }
        if (debug){
            console.trace("重新映射了{}位分数持有者的Entry", count);
        }
    }, 0, 200, true); //每200t运行一次任务，异步
});

}
