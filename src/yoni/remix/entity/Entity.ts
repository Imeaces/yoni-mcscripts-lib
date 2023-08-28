import { Minecraft } from "../../basis.js";
import { EntityUtils } from "../../EntityUtils.js";
import { EntityWraps } from "./EntityWraps.js";
import { EntryType } from "../../scoreboard/EntryType.js";
import { ScoreboardEntry } from "../../scoreboard/ScoreboardEntry.js";
import { Dimension } from "../dimension.js";
import { DimensionLikeValue } from "../../types";
import { Location, Vector2, Vector3 } from "../Location.js";
import { copyPropertiesWithoutOverride } from "../../lib/ObjectUtils.js";
import { Command } from "../../command.js";

const { EntityTypes } = Minecraft;

/**
 * 代表一个实体
 */
class Entity {
    
    /**
     * 这个属性映射了一个原版中的实体对象。
     * @type {Minecraft.Entity}
     */
    readonly vanillaEntity: Minecraft.Entity;
    
    /**
     * @hideconstructor
     * @param {Minecraft.Entity} entity
     */
    constructor(entity: Minecraft.Entity){
        this.vanillaEntity = entity;
        
        Object.defineProperty(this, "vanillaEntity", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: entity
        });
    }
    
    get [Symbol.toStringTag](){
        if (this instanceof Entity)
            return `Entity: { type: ${this.vanillaEntity.typeId} }`;
        return "Object (Entity)";
    }
    
    get velocity() {
        return this.vanillaEntity.getVelocity();
    }
    
    get rotation(){
        return this.vanillaEntity.getRotation();
    }
    
    get entityType() {
        return EntityTypes.get(this.typeId);
    }
    
    get dimension(): Dimension {
        return Dimension.toDimension(this.vanillaEntity.dimension);
    }

    get location(): Location {
        const location = Location.zero;
        location.setDimension(this.vanillaEntity.dimension);
        location.setPosition(this.vanillaEntity.location);
        location.setRotation(this.vanillaEntity.getRotation());
        return location;
    }
    
    get scoreboard(): ScoreboardEntry {
        return ScoreboardEntry.getEntry(EntryType.ENTITY, this.vanillaEntity);
    }
    
    /**
     * 此方法可以在任何时候调用
     *
     * 返回实体是否可用（即此对象对应的实体是否处于活动状态（即实体处于世界的已加载区域（即已经读取到内存的地图）
     */
    isAliveEntity(){
        return EntityUtils.isAliveEntity(this.vanillaEntity);
    }
    
    /**
     * 返回实体是否为活体。
     */
    isLivingEntity(){
        return EntityUtils.isLivingEntity(this.vanillaEntity);
    }
    
    /**
     * 获取实体的当前血量。
     */
    getCurrentHealth(){
        return EntityUtils.getCurrentHealth(this.vanillaEntity);
    }
    
    /**
     * 获取实体的血量组件。
     */
    getHealthComponent(){
        return EntityUtils.getHealthComponent(this.vanillaEntity);
    }
    
    /**
     * 获取实体的物品栏容器。
     */
    getInventory(){
        return EntityUtils.getInventory(this.vanillaEntity);
    }
    
    /**
     * 获取实体的最大血量。
     */
    getMaxHealth(){
        return EntityUtils.getMaxHealth(this.vanillaEntity);
    }
    
    /**
     * 检测实体是否为某一族。
     * @abc
     * @param {string} family
     */
    hasFamily(family: string){
        return EntityUtils.hasAnyFamily(this.vanillaEntity, family);
    }
    /**
     * 检测实体是否有指定的多个族中的一个。
     * @param {...string} families 
     * @returns {boolean}
     */
    hasAnyFamily(...families: string[]){
        return EntityUtils.hasAnyFamily(this.vanillaEntity, ...families);
    }
    
    /**
     * 请求以此实体的上下文执行命令。
     * @param {string} cmd 
     * @returns {Promise<Minecraft.CommandResult>}
     */
    fetchCommand(cmd: string){
        return Command.fetchExecute(this.vanillaEntity, cmd);
    }
    
    /**
     * @param {string} message
     */
    say(message: string){
        let command = "say " + message;
        return Command.fetchExecute(this.vanillaEntity, command);
    }
    
    /**
     * @param {number} v
     */
    setCurrentHealth(health: number){
        return EntityUtils.setCurrentHealth(this.vanillaEntity, health);
    }
    
    /**
     * @beta
     * Retrieves or sets an entity that is used as the target of
     * AI-related behaviors, like attacking.
     * @returns 目标不存在时返回 `undefined`。
     * @throws This property can throw when used.
     */
    get target(): Entity {
        return (EntityUtils.from(this.vanillaEntity.target) ?? undefined) as unknown as Entity;
    }
    
    addEffect(effectType: string | Minecraft.EffectType, duration: number, amplifier: number, showParticle: boolean): void;
    addEffect(effectType: string | Minecraft.EffectType, duration: number, options?: Minecraft.EntityEffectOptions): void;
    addEffect(effectType: string | Minecraft.EffectType, duration: number, amplifier?: Minecraft.EntityEffectOptions | number, showParticles?: boolean): void {
        let option = amplifier as Minecraft.EntityEffectOptions;
        if (isFinite(amplifier as number)){
            option = {
                amplifier: amplifier as number,
                showParticles: showParticles as boolean
            }
        }
        if (option){
            this.vanillaEntity.addEffect(effectType, duration, option);
        } else {
            this.vanillaEntity.addEffect(effectType, duration);
        }
    }
    
    //@ts-ignore 我也不知道是怎么回事
    teleport(location: Vector3, options?: Minecraft.TeleportOptions): void;
    //@ts-ignore 反正已经实现了
    teleport(coords: Vector3, dimension: DimensionLikeValue, rotationX: number, rotationY: number, keepVelocity?: boolean): void;
    //@ts-ignore
    teleport(location: Location, keepVelocity?: boolean): void;
    teleport(...params: [ Location ] | [ Location, boolean ]
        | [ Vector3 ] | [ Vector3, Minecraft.TeleportOptions ]
        | [ Vector3, DimensionLikeValue, number, number ]
        | [ Vector3, DimensionLikeValue, number, number, boolean ]){
        this.#executeTeleport(this.vanillaEntity.teleport, params);
    }
    
    //@ts-ignore 我也不知道是怎么回事
    tryTeleport(location: Vector3, options?: Minecraft.TeleportOptions): boolean;
    //@ts-ignore 反正已经实现了
    tryTeleport(coords: Vector3, dimension: DimensionLikeValue, rotationX: number, rotationY: number, keepVelocity?: boolean): boolean;
    //@ts-ignore
    tryTeleport(location: Location, keepVelocity?: boolean): boolean;
    tryTeleport(...params: [ Location ] | [ Location, boolean ]
        | [ Vector3 ] | [ Vector3, Minecraft.TeleportOptions ]
        | [ Vector3, DimensionLikeValue, number, number ]
        | [ Vector3, DimensionLikeValue, number, number, boolean ]){
        return this.#executeTeleport(this.vanillaEntity.tryTeleport, params) as boolean;
    }
    
    #executeTeleport(teleportFunc: any, params: [ Location ] | [ Location, boolean ]
        | [ Vector3 ] | [ Vector3, Minecraft.TeleportOptions ]
        | [ Vector3, DimensionLikeValue, number, number ]
        | [ Vector3, DimensionLikeValue, number, number, boolean ]): any {
        
        let coords: Vector3;
        //@ts-ignore
        let options: Minecraft.TeleportOptions = {};
        if (params[0] instanceof Location){
            const location = params[0];
            coords = location.getVanillaLocation();
        } else {
            coords = params[0] as Vector3;
        }
        if (params.length === 2){
            if (params[1] === true || params[1] === false)
                options.keepVelocity = params[1];
            else
                options = params[1] as Minecraft.TeleportOptions;
        } else if (params.length === 1 && (params[0] instanceof Location)){
            const location = params[0] as Location;
            options.dimension = location.dimension.vanillaDimension;
            const { rx: x, ry: y } = location;
            const rotation: Vector2 = { x, y };
            options.rotation = rotation;
        } else if (params.length > 1){
            options.dimension = Dimension.toDimension(params[1] as DimensionLikeValue).vanillaDimension;
            const rotation: Vector2 = { x: params[2] as number, y: params[3] as number };
            options.rotation = rotation;
            if (params[4] === true || params[4] === false)
                options.keepVelocity = params[4];
        }
        
        teleportFunc.call(this.vanillaEntity, coords, options);
    }
}

copyPropertiesWithoutOverride(Entity.prototype, Minecraft.Entity.prototype, "vanillaEntity", ["getRotation", "getVelocity", "addEffect"]);

EntityWraps.registerWrap(Entity, Minecraft.Entity);

type RemovedKeys = "getRotation" | "getVelocity"
type OverridedKeys = "target" | "tryTeleport" | "teleport" | "addEffect" | "dimension"
type BaseVanillaEntityClass = 
    Omit<
        Minecraft.Entity,
        RemovedKeys | OverridedKeys
    >;
interface Entity extends BaseVanillaEntityClass {
}

export { Entity, Entity as YoniEntity };
