import { EntityWraps } from "./remix/entity/EntityWraps.js";
import {
    Minecraft,
    Gametest,
    VanillaWorld
} from "./basis.js";
import { getAllVanillaDimensions } from "./dimensionutils.js";

import type { DimensionLikeValue, EntityValue, PlayerEntityValue } from "./types";
import type {
    YoniPlayer,
    YoniEntity,
    YoniSimulatedPlayer
} from "./remix/entity/index.js";

export function isEntityValid(entity: any){
    return EntityBase.isAliveEntity(entity);
}

export function getEntity(world: Minecraft.World, id: string): Minecraft.Entity | undefined {
    throw new ReferenceError("not implemented");
}


/**
 * 一系列处理实体的方法。
 */
export class EntityUtils {
    
    /**
     * 检查一个对象是否为实体对象。
     * @param {any} object - 任意。
     * @throws 当不是实体的时候抛出错误。
     */
    static checkIsEntity(object: any){
        if (!EntityUtils.isEntity(object)){
            throw new TypeError("Not a Entity type");
        }
    }
    
    /**
     * （内部方法）由实体对象创建对应的 YoniEntity 实体对象。
     * 
     * 一般情况下你不应该使用此方法，而是使用 {@link EntityUtils.getYoniEntity}。
     * @param {any} entity - 可以被认为是实体的东西。
     * @return {YoniEntity} 如果 `entity` 不为实体类型，则返回 `null`。
     */
    static from(entity: any): YoniEntity | null {
        if (EntityUtils.isYoniEntity(entity))
            return entity;
        return EntityWraps.fromSourceEntity(entity) as (YoniEntity | null);
    }
    
    /**
     * 检测指定实体对象是否为玩家实体对象。
     * @param {EntityValue} entity 要检测的实体。
     * @returns {boolean}
     */
    static entityIsPlayer(entity: EntityValue): entity is (Minecraft.Player | YoniPlayer) {
        return EntityUtils.isPlayer(EntityUtils.getMinecraftEntity(entity));
    }
    
    /**
     * 获取实体的已经存在于世界上的 YoniEntity 对象实例。
     */
    static getAliveEntity(entity: EntityValue): YoniEntity {
        return EntityUtils.from(EntityUtils.getAliveVanillaEntity(entity)) as YoniEntity;
    }
    
    /**
     * 获取实体的已经存在于世界上的香草实体对象实例。
     */
    static getAliveVanillaEntity(entity: EntityValue): Minecraft.Entity {
        if (isEntityValid(entity))
            return EntityUtils.getMinecraftEntity(entity);
        
        const result = getEntity(VanillaWorld, entity.id);
        if (result){
            return result;
        }
        throw new ReferenceError("no entity found");
    }
    
    /**
     * 获取所有已经载入的实体的对象实例。
     * @param {MinecraftEntityQueryOptions} option
     * @return {YoniEntity[]}
     */
    static getAliveEntities(option: MinecraftEntityQueryOptions): YoniEntity[] {
        return Array.from(EntityUtils.getDimensionVanillaEntities()).map(EntityUtils.from) as unknown as YoniEntity[];
    }
    
    /**
     * 获取活体实体的 `minecraft:health` 组件。
     * @param {EntityValue} entity 
     * @returns {Minecraft.EntityHealthComponent}
     */
    static getHealthComponent(entity: EntityValue): Minecraft.EntityHealthComponent {
        EntityUtils.checkIsEntity(entity);
        const comp = entity.getComponent("minecraft:health") as Minecraft.EntityHealthComponent;
        if (comp == undefined)
            throw new Error("not a living entity");
        return comp;
    }
    
    /**
     * 尝试获取实体的 `minecraft:health` 组件。
     * @param {EntityValue} entity 
     * @returns {Minecraft.EntityHealthComponent}
     */
    static tryGetHealthComponent(entity: EntityValue): Minecraft.EntityHealthComponent | false {
        EntityUtils.checkIsEntity(entity);
        return entity.getComponent("minecraft:health") as Minecraft.EntityHealthComponent ?? false;
    }
    
    /**
     * 获取实体的物品栏容器对象。
     * @param {EntityValue} entity 
     * @returns {Minecraft.InventoryComponentContainer}
     */
    static getInventory(entity: EntityValue): Minecraft.Container {
        EntityUtils.checkIsEntity(entity);
        
        if (EntityUtils.#inventoryCache.has(entity))
            return EntityUtils.#inventoryCache.get(entity) as Minecraft.Container;
        
        const comp = entity.getComponent("minecraft:inventory") as unknown as Minecraft.EntityInventoryComponent;
        
        if (comp == undefined)
            throw new ReferenceError("no inventory container in the entity");
        
        const inv = comp.container;
        
        EntityUtils.#inventoryCache.set(entity, inv);
        
        return inv;
    }
    static #inventoryCache = new WeakMap<Object, Minecraft.Container>();
    
    /**
     * 获取玩家主手上的物品。
     */
    static getItemInMainHand(entity: PlayerEntityValue): Minecraft.ItemStack | undefined {
        return EntityUtils.getInventory(entity).getItem(entity.selectedSlot);
    }
    
    /**
     * 设置玩家主手上的物品。
     */
    static setItemInMainHand(entity: PlayerEntityValue, item?: Minecraft.ItemStack): void {
        EntityUtils.getInventory(entity).setItem(entity.selectedSlot, item);
    }
    
    /**
     * 获取活体实体的血量。
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getCurrentHealth(entity: EntityValue): number {
        const component = EntityUtils.tryGetHealthComponent(entity);
        return component ? component.current : 0;
    }

    /**
     * 遍历所有维度以获取所有存活着的实体。
     */
    static getDimensionVanillaEntities(options?: Minecraft.EntityQueryOptions) {
        const dimensionArrays = getAllVanillaDimensions();
        
        let entitiesArrays: Minecraft.Entity[][];
        if (!options){
            entitiesArrays = dimensionArrays.map(dim => Array.from(dim.getEntities()));
        } else {
            entitiesArrays = dimensionArrays.map(dim => Array.from(dim.getEntities(Object.assign(new Minecraft.EntityQueryOptions(), options))));
        }
        
        return ([] as Minecraft.Entity[]).concat(...entitiesArrays);
    
    }
    
    /**
     * 获取世界内存在的玩家。
     */
    static getWorldVanillaPlayers(options?: MinecraftEntityQueryOptions): Array<Minecraft.Player> {
        if (options)
            return Array.from(VanillaWorld.getPlayers(Object.assign(new Minecraft.EntityQueryOptions(), options)));
        else
            return Array.from(VanillaWorld.getPlayers());
    }
    
    /**
     * 获取世界内存在的所有实体（这包括死亡的玩家）。
     *
     * 尽管此方法已经尽了它最大的努力，但是对于一些特殊实体（如minecraft:agent），它们仍然不包含在返回结果中。
     * @returns {EntityValue[]}
     */
    static getLoadedVanillaEntities(): Minecraft.Entity[] {
        return ([] as Minecraft.Entity[]).concat(
            EntityUtils.getDimensionVanillaEntities({excludeTypes: ["minecraft:player"]}),
            EntityUtils.getWorldVanillaPlayers()
        );
    }
    
    /**
     * 获取实体可达到的最大血量。
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getMaxHealth(entity: EntityValue){
        const component = EntityUtils.tryGetHealthComponent(entity);
        return component ? component.value : 0;
    }
    
    /**
     * 获取实体对象对应的 Minecraft.Entity。
     * @param {EntityValue} entity
     * @returns {MinecraftEntityType}
     */
    static getMinecraftEntity(entity: EntityValue): Minecraft.Entity {
        if (EntityUtils.isMinecraftEntity(entity))
            return entity;
        else if (EntityUtils.isYoniEntity(entity))
            return entity.vanillaEntity;
        throw new Error("no reference or not an entity");
    }
    
    /**
     * 获取实体对象对应的 YoniEntity。
     * @param {EntityValue} entity
     * @returns {YoniEntityType}
     * @throws 如果参数不是实体将会抛出错误
     */
    static getYoniEntity(entity: EntityValue): YoniEntity {
        EntityUtils.checkIsEntity(entity);
        return EntityUtils.from(entity) as unknown as YoniEntity;
    }
    
    /**
     * 检测实体是否有所有指定的家族。
     * @param {EntityValue} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasFamilies(entity: EntityValue, ...families: string[]){
        entity = EntityUtils.getMinecraftEntity(entity);
        const dimension = entity.dimension;
        const tryEntities = dimension.getEntities(
            Object.assign(new Minecraft.EntityQueryOptions, {
                type: entity.id,
                families
            })
        );
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
        entity = EntityUtils.getMinecraftEntity(entity);
        
        const dimension = entity.dimension;
        
        for (const family of families){
            const tryEntities = dimension.getEntities(
                Object.assign(new Minecraft.EntityQueryOptions, {
                type: entity.id,
                families: Array.of(family)
                })
            );
            
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
        return EntityUtils.hasFamilies(entity, family);
    }
    
    /**
     * 检测一个实体是否存在于世界上。
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isAliveEntity(entity: EntityValue){
        try {
            EntityBase.getYoniEntity(entity).vanillaEntity.id;
        } catch {
            return false;
        }
        return true;
    }
    
    /**
     * 检测一个实体是否活着。
     *
     * 例如；物品、箭、烟花不是生物实体。
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isLivingEntity(entity: EntityValue){
        EntityUtils.checkIsEntity(entity);
        
        const comp = entity.getComponent("minecraft:health") as Minecraft.EntityHealthComponent;
        
        if (comp == undefined)
            return false;
        
        return comp.current > 0;
    }
    
    /**
     * 检测参数是否为实体。
     * @param {any} obj
     * @returns {boolean}
     */
    static isEntity(object: any): object is (YoniEntity | Minecraft.Entity){
        if (EntityUtils.isYoniEntity(object))
            return true;
        if (EntityUtils.isMinecraftEntity(object))
            return true;
         return false;
    }
    
    /**
     * 检测参数是否为玩家实体。
     * @param {any} obj
     * @returns {boolean}
     */
    static isPlayer(object: any): object is (YoniPlayer | Minecraft.Player) {
         return EntityUtils.isEntity(object) && object.typeId === "minecraft:player";
    }
    
    /**
     * 检测参数是否为原版实体。
     * @param {any} object
     * @returns {boolean}
     */
    static isMinecraftEntity(object: any): object is Minecraft.Entity {
        if (object != null)
            try {
                return EntityWraps.prototypeWraps.has(Object.getPrototypeOf(object));
            } catch {
                // no thing
            }
        return false;
    }
    
    /**
     * 检测两个参数是否为实体且代表同一实体
     */
    static isSameEntity(entity1: any, entity2: any){
        entity1 = EntityUtils.from(entity1);
        return entity1 != null && entity1 === EntityUtils.from(entity2);
    }

    /**
     * 检测参数是否为 YoniEntity。
     * @param {any} object
     * @returns {boolean}
     */
    static isYoniEntity(object: any): object is YoniEntity {
        if (object != null)
            try {
                return EntityWraps.srcPrototypeWraps.has(Object.getPrototypeOf(object));
            } catch {
                //no thing
            }
        return false;
    }
    
    /**
     * 设置实体的血量。
     * @param {EntityValue} entity
     * @param {number} val
     */
    static setCurrentHealth(entity: EntityValue, value: number){
        EntityUtils.getHealthComponent(entity)
            .setCurrent(value);
    }
    
}

interface MinecraftEntityQueryOptions extends Partial<Minecraft.EntityQueryOptions> {
}