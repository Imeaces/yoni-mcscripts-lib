import { Minecraft } from "../basis.js";
import { DimensionLike } from "../Location.js";
import { EntityValue } from "./EntityTypeDefs.js";
import YoniEntity from "./Entity.js";
import YoniPlayer from "./Player.js";
/**
 * 代表一个实体
 */
declare class EntityBase {
    /**
     * @type {Minecraft.Entity}
     */
    readonly vanillaEntity: Minecraft.Entity;
    /**
     * @hideconstructor
     * @param {Minecraft.Entity} entity
     */
    constructor(entity: Minecraft.Entity);
    /**
     * 检查一个东西是否为实体
     * @param {any} object - 任意
     * @throws 当不是实体的时候抛出错误
     */
    static checkIsEntity(object: any): void;
    /**
     * 由实体对象创建对应的 YoniEntity 实体对象，这个方法确保了实体对象的唯一。
     *
     * 如果要确保一定能获取到 YoniEntity 对象，请使用 {@link EntityBase.getYoniEntity}
     * @param {any} entity - 可以被认为是实体的东西，出于代码便利，允许传入任何值。实际上只有实体类型的对象才有效果。
     * @return {YoniEntity} 如果 `entity` 不为实体类型，则返回 `null`。
     */
    static from(entity: any): YoniEntity | null;
    /**
     * 检测某个实体是否为玩家
     * @param {EntityValue} entity 要检测的实体
     * @returns {boolean}
     * @throws 当参数不是实体时抛出错误
     */
    static entityIsPlayer(entity: EntityValue): entity is (Minecraft.Player | YoniPlayer);
    /**
     * 获取所有存活的实体
     * @param {Minecraft.EntityQueryOptions} option
     * @return {YoniEntity[]}
     */
    static getAliveEntities(option: Minecraft.EntityQueryOptions): YoniEntity[];
    /**
     * 获取实体的minecraft:health组件
     * @param {EntityValue} entity
     * @returns {Minecraft.EntityHealthComponent}
     */
    static getHealthComponent(entity: EntityValue): Minecraft.EntityHealthComponent;
    /**
     * 获取实体的物品栏
     * @param {EntityValue} entity
     * @returns {Minecraft.InventoryComponentContainer}
     */
    static getInventory(entity: EntityValue): Minecraft.Container;
    /**
     * 获取实体的血量
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getCurrentHealth(entity: EntityValue): number;
    /**
     * @param {import('../Location.js').DimensionLike} dimension
     * @param {Minecraft.EntityQueryOptions} [options]
     */
    static getDimensionEntities(dimension?: DimensionLike, options?: Minecraft.EntityQueryOptions): Iterable<Minecraft.Entity>;
    /**
     * @param {import('.../Location.js').DimensionLike}
     * @param {Minecraft.EntityQueryOptions} [options]
     */
    static getWorldPlayers(options?: Minecraft.EntityQueryOptions): Iterable<Minecraft.Player>;
    /**
     * 获取所有存在的实体（包括死亡的玩家）
     * @returns {EntityValue[]}
     */
    static getLoadedEntities(): Minecraft.Entity[];
    /**
     * 获取实体最大血量
     * @param {EntityValue} entity
     * @returns {number}
     */
    static getMaxHealth(entity: EntityValue): number;
    /**
     * 得到一个Minecraft.Entity
     * @param {EntityValue} entity
     * @returns {MinecraftEntityType}
     */
    static getMinecraftEntity(entity: EntityValue): Minecraft.Entity;
    /**
     * 得到一个Entity
     * @param {EntityValue} entity
     * @returns {YoniEntityType}
     * @throws 如果参数不是实体将会抛出错误
     */
    static getYoniEntity(entity: EntityValue): YoniEntity;
    /**
     * 检测一个实体是否有指定的所有种族
     * @param {EntityValue} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasFamilies(entity: EntityValue, ...families: string[]): boolean;
    /**
     * 检测一个实体是否任一指定的种族
     * @param {EntityValue} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasAnyFamily(entity: EntityValue, ...families: string[]): boolean;
    /**
     * 检测一个实体是否有某个种族
     * @param {EntityValue} entity
     * @param {string} family
     * @returns {boolean}
     */
    static hasFamily(entity: EntityValue, family: string): boolean;
    /**
     * 检测一个实体是否存在于世界上
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isAliveEntity(entity: EntityValue): boolean;
    /**
     * 检测一个实体是否活着
     * 物品、箭、烟花等不是活的
     * 死了的实体也不是活的
     * @param {EntityValue} entity
     * @returns {boolean}
     */
    static isAlive(entity: EntityValue): boolean;
    /**
     * 检测参数是否为实体
     * @param {any} obj
     * @returns {boolean}
     */
    static isEntity(obj: any): obj is (YoniEntity | Minecraft.Entity);
    /**
     * 检测参数是否为原版实体
     * @param {any} object
     * @returns {boolean}
     */
    static isMinecraftEntity(object: any): object is Minecraft.Entity;
    /**
     * 检测两个参数是否为同一实体
     * @param {any} ent1
     * @param {any} ent2
     */
    static isSameEntity(ent1: any, ent2: any): boolean;
    /**
     * 检测参数是否为YoniEntity
     * @param {any} object
     * @returns {boolean}
     */
    static isYoniEntity(object: any): object is YoniEntity;
    /**
     * 设置实体的血量
     * @param {EntityValue} entity
     * @param {number} val
     */
    static setCurrentHealth(entity: EntityValue, val: number): void;
}
export { EntityBase };
