import { Minecraft } from "../basis.js";
import { EntityBase } from "./EntityBase.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";
import { Entry } from "../scoreboard/Entry.js";
import { Dimension } from "../dimension.js";
import { Location } from "../Location.js";
import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";
import { Command } from "../command.js";

const { EntityTypes } = Minecraft;

/**
 * 代表一个实体
 */
export class Entity extends EntityBase {
    
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
        return EntityTypes.get((this as unknown as YoniEntity).typeId);
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
    
    get scoreboard(): Entry {
        return Entry.findEntry({entity: this.vanillaEntity});
    }
    
    /**
     * 返回实体是否为活体。
     */
    isAliveEntity(){
        return EntityBase.isAliveEntity(this.vanillaEntity);
    }
    
    /**
     * 此方法可以在任何时候调用
     *
     * 返回实体是否可用（即此对象对应的实体是否处于活动状态（即实体处于世界的已加载区域（即已经读取到内存的地图）
     */
    isAlive(){
        return EntityBase.isAlive(this.vanillaEntity);
    }
    
    /**
     * 获取实体的当前血量。
     */
    getCurrentHealth(){
        return EntityBase.getCurrentHealth(this.vanillaEntity);
    }
    
    /**
     * 获取实体的血量组件。
     */
    getHealthComponent(){
        return EntityBase.getHealthComponent(this.vanillaEntity);
    }
    
    /**
     * 获取实体的物品栏容器。
     */
    getInventory(){
        return EntityBase.getInventory(this.vanillaEntity);
    }
    
    /**
     * 获取实体的最大血量。
     */
    getMaxHealth(){
        return EntityBase.getMaxHealth(this.vanillaEntity);
    }
    
    /**
     * 检测实体是否为某一族。
     * @abc
     * @param {string} family
     */
    hasFamily(family: string){
        return EntityBase.hasAnyFamily(this.vanillaEntity, family);
    }
    /**
     * 检测实体是否有指定的多个族中的一个。
     * @param {...string} families 
     * @returns {boolean}
     */
    hasAnyFamily(...families: string[]){
        return EntityBase.hasAnyFamily(this.vanillaEntity, ...families);
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
        return EntityBase.setCurrentHealth(this.vanillaEntity, health);
    }
    
    /**
     * @beta
     * Retrieves or sets an entity that is used as the target of
     * AI-related behaviors, like attacking.
     * @returns 目标不存在时返回 `undefined`。
     * @throws This property can throw when used.
     */
    get target(): YoniEntity {
        return (EntityBase.from(this.vanillaEntity.target) ?? undefined) as unknown as YoniEntity;
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

}

copyPropertiesWithoutOverride(Entity.prototype, Minecraft.Entity.prototype, "vanillaEntity");

EntityClassRegistry.register(Entity, Minecraft.Entity);

type BaseVanillaEntityClass = Omit<Omit<Minecraft.Entity, "getRotation" | "getVelocity" | "addEffect">, keyof Entity>;
export type YoniEntity = Entity & BaseVanillaEntityClass;
