import {
    Minecraft,
    Gametest,
    VanillaWorld,
} from "../basis.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";
import { Dimension } from "../dimension.js";
import { EntityValue } from "./EntityTypeDefs.js";
import { DimensionLikeValue } from "../dim.js";

import { YoniPlayer, YoniEntity, YoniSimulatedPlayer } from "../entity.js";

/**
 * Yoni实体的基类，同时也含有一些用于处理实体的静态方法。
 */
export abstract class EntityBase {
    
    /**
     * 这个属性映射了一个原版中的实体对象。
     * @type {Minecraft.Entity}
     */
    // @ts-ignore
    readonly vanillaEntity: Minecraft.Entity;
    
    /**
     * @hideconstructor
     * @param {Minecraft.Entity} entity
     */
    protected constructor(entity: Minecraft.Entity){
    
        if (!EntityClassRegistry.includesInSrcPrototype(Object.getPrototypeOf(entity)))
            throw new TypeError("no mapping for the object proto");
        
        Object.defineProperty(this, "vanillaEntity", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: entity
        });
    }
    
    abstract isAliveEntity(): boolean;
    abstract isLivingEntity(): boolean;
    
    /**
     * 检查一个东西是否为实体
     * @param {any} object - 任意
     * @throws 当不是实体的时候抛出错误
     */
    static checkIsEntity(object: any){
        if (!EntityBase.isEntity(object))
            throw new TypeError("Not a Entity type");
    }
    
    /**
     * 由实体对象创建对应的 YoniEntity 实体对象，这个方法确保了实体对象的唯一，并且此过程中不会进行太多的检查。
     * 
     * 一般情况下你不应该使用此方法，而是使用 {@link EntityBase.getYoniEntity}。
     * @param {any} entity - 可以被认为是实体的东西，出于代码便利，允许传入任何值。实际上只有实体类型的对象才有效果。
     * @return {YoniEntity} 如果 `entity` 不为实体类型，则返回 `null`。
     */
    static from(entity: any): YoniEntity | null {
        return EntityClassRegistry.from(entity);
    }
    
    /**
     * 检测某个实体是否为玩家
     * @param {EntityValue} entity 要检测的实体
     * @returns {boolean}
     * @throws 当参数不是实体时抛出错误
     */
    static entityIsPlayer(entity: EntityValue): entity is (Minecraft.Player | YoniPlayer) {
        entity = EntityBase.getMinecraftEntity(entity);
        if (entity instanceof Minecraft.Player)
            return true;
        return false;
    }
    
    static getAliveEntity(entity: EntityValue): YoniEntity {
        return EntityBase.from(EntityBase.getAliveVanillaEntity(entity)) as YoniEntity;
    }
    
    static getAliveVanillaEntity(entity: EntityValue): Minecraft.Entity {
        if (entity.isValid())
            return EntityBase.getMinecraftEntity(entity);
        
        const result = VanillaWorld.getEntity(entity.id);
        if (result){
            return result;
        }
        throw new ReferenceError("no entity found");
    }
    
    /**
     * 获取所有存活的实体
     * @param {MinecraftEntityQueryOptions} option
     * @return {YoniEntity[]}
     */
    static getAliveEntities(option: MinecraftEntityQueryOptions): YoniEntity[] {
        return Array.from(EntityBase.getDimensionVanillaEntities()).map(EntityBase.from) as unknown as YoniEntity[];
    }
    
    /**
     * 获取实体的minecraft:health组件
     * @param {EntityValue} entity 
     * @returns {Minecraft.EntityHealthComponent}
     */
    static getHealthComponent(entity: EntityValue): Minecraft.EntityHealthComponent {
        EntityBase.checkIsEntity(entity);
        return entity.getComponent("minecraft:health") as Minecraft.EntityHealthComponent;
    }
    
    /**
     * 获取实体的物品栏
     * @param {EntityValue} entity 
     * @returns {Minecraft.InventoryComponentContainer}
     */
    static getInventory(entity: EntityValue): Minecraft.Container {
        if (EntityBase.#inventoryCache.has(entity))
            return EntityBase.#inventoryCache.get(entity) as Minecraft.Container;
        
        EntityBase.checkIsEntity(entity);
        
        const comp = entity.getComponent("minecraft:inventory") as unknown as Minecraft.EntityInventoryComponent;
        
        const inv = comp.container;
        
        EntityBase.#inventoryCache.set(entity, inv);
        
        return inv;
    }
    static #inventoryCache = new WeakMap<Object, Minecraft.Container>();
    
    static getItemInMainHand(entity: EntityValue): Minecraft.ItemStack | undefined {
        //@ts-ignore
        return EntityBase.getInventory(entity).getItem(entity.selectedSlot);
    }
    
    static setItemInMainHand(entity: EntityValue, item?: Minecraft.ItemStack): void {
        //@ts-ignore
        EntityBase.getInventory(entity).setItem(entity.selectedSlot, item);
    }
    
    /**
     * 获取实体的血量
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getCurrentHealth(entity: EntityValue): number {
        let component = EntityBase.getHealthComponent(entity);
        return (component === undefined) ? 0 : component.currentValue;
    }
    
    static getDimensionVanillaEntities(options?: MinecraftEntityQueryOptions) {
        const dimensionArrays = Object.getOwnPropertyNames(Minecraft.MinecraftDimensionTypes)
            .map(key => Dimension.toDimension((Minecraft.MinecraftDimensionTypes as any)[key] as DimensionLikeValue).vanillaDimension);
        
        let entitiesArrays: Minecraft.Entity[][];
        if (!options){
            entitiesArrays = dimensionArrays.map(dim => dim.getEntities());
        } else {
            entitiesArrays = dimensionArrays.map(dim => dim.getEntities(Object.assign(new Minecraft.EntityQueryOptions(), options)));
        }
        
        return ([] as Minecraft.Entity[]).concat(...entitiesArrays);
    
    }
    
    static getWorldVanillaPlayers(options?: MinecraftEntityQueryOptions): Array<Minecraft.Player> {
        if (options)
            return Array.from(VanillaWorld.getPlayers(Object.assign(new Minecraft.EntityQueryOptions(), options)));
        else
            return Array.from(VanillaWorld.getPlayers());
    }
    
    /**
     * 获取所有存在的实体（包括死亡的玩家）
     * @returns {EntityValue[]}
     */
    static getLoadedVanillaEntities(): Minecraft.Entity[] {
        return ([] as Minecraft.Entity[]).concat(
            EntityBase.getDimensionVanillaEntities({excludeTypes: ["minecraft:player"]}),
            EntityBase.getWorldVanillaPlayers()
        );
    }
    
    /**
     * 获取实体最大血量
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getMaxHealth(entity: EntityValue){
        let component = EntityBase.getHealthComponent(entity);
        return (component === undefined) ? 0 : component.effectiveMax;
    }
    
    /**
     * 得到一个Minecraft.Entity
     * @param {EntityValue} entity
     * @returns {MinecraftEntityType}
     */
    static getMinecraftEntity(entity: EntityValue): Minecraft.Entity {
        EntityBase.checkIsEntity(entity);
        if (EntityBase.isMinecraftEntity(entity))
            return entity;
        else if (EntityBase.isYoniEntity(entity))
            return entity.vanillaEntity;
        throw new Error("no reference");
    }
    
    /**
     * 得到一个Entity
     * @param {EntityValue} entity
     * @returns {YoniEntityType}
     * @throws 如果参数不是实体将会抛出错误
     */
    static getYoniEntity(entity: EntityValue): YoniEntity {
        EntityBase.checkIsEntity(entity);
        return EntityBase.from(entity) as unknown as YoniEntity;
    }
    
    /**
     * 检测实体是否有所有指定的家族。
     * @param {EntityValue} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasFamilies(entity: EntityValue, ...families: string[]){
        entity = EntityBase.getMinecraftEntity(entity);
        const dimension = entity.dimension;
        const tryEntities = dimension.getEntities({
            type: entity.typeId,
            families: families
        });
        for (const cEntity of tryEntities){
            if (entity === cEntity){
                return true;
            }
        }
        return false;
    }
    
    /**
     * 检测实体是否有任一指定的家族。
     * @param {EntityValue} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasAnyFamily(entity: EntityValue, ...families: string[]){
        entity = EntityBase.getMinecraftEntity(entity);
        
        const dimension = entity.dimension;
        
        for (const family of families){
            const tryEntities = dimension.getEntities({
                type: entity.typeId,
                families: Array.of(family)
            });
            
            for (const cEntity of tryEntities){
                if (entity === cEntity){
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * 检测实体是否含有指定家族。
     * @param {EntityValue} entity
     * @param {string} family
     * @returns {boolean}
     */
    static hasFamily(entity: EntityValue, family: string){
        return EntityBase.hasFamilies(entity, family);
    }
    
    /**
     * 检测一个实体是否存在于世界上。
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isAliveEntity(entity: EntityValue){
        return entity.isValid();
    }
    
    /**
     * 检测一个实体是否活着。
     *
     * 例如；物品、箭、烟花不是生物实体。
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isLivingEntity(entity: EntityValue){
        EntityBase.checkIsEntity(entity);
        
        const comp = entity.getComponent("minecraft:health") as Minecraft.EntityHealthComponent;
        
        if (comp == null)
            return false;
        
        return comp.currentValue > 0;
    }
    
    /**
     * 检测参数是否为实体
     * @param {any} obj
     * @returns {boolean}
     */
    static isEntity(obj: any): obj is (YoniEntity | Minecraft.Entity){
        if (EntityBase.isYoniEntity(obj))
            return true;
        if (EntityBase.isMinecraftEntity(obj))
            return true;
         return false;
    }
    
    /**
     * 检测参数是否为原版实体
     * @param {any} object
     * @returns {boolean}
     */
    static isMinecraftEntity(object: any): object is Minecraft.Entity {
        if (object == null) return false;
        return EntityClassRegistry.includesInSrcPrototype(
            Object.getPrototypeOf(object)
        );
    }
    
    /**
     * 检测两个参数是否为同一实体
     */
    static isSameEntity(entity1: any, entity2: any){
        return EntityBase.isEntity(entity1)
        && EntityBase.isEntity(entity2)
        && entity1.id === entity2.id;
    }

    /**
     * 检测参数是否为YoniEntity
     * @param {any} object
     * @returns {boolean}
     */
    static isYoniEntity(object: any): object is YoniEntity {
        return object instanceof EntityBase;
    }
    
    /**
     * 设置实体的血量
     * @param {EntityValue} entity
     * @param {number} val
     */
    static setCurrentHealth(entity: EntityValue, val: number){
        let component = EntityBase.getHealthComponent(entity);
        if (!component){
            throw new Error("No health component for this entity");
        }
        component.setCurrentValue(val);
    }
    
}

interface MinecraftEntityQueryOptions extends Optional<Minecraft.EntityQueryOptions> {
}