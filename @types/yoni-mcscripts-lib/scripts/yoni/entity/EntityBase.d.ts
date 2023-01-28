/**
 * @typedef {Entity|Player|SimulatedPlayer} YoniEntityType
 * @typedef {Minecraft.Player|Minecraft.Entity|Gametest.SimulatedPlayer} MinecraftEntityType
 * @typedef {YoniEntityType|MinecraftEntityType} EntityType
 */
/**
 * 代表一个实体
 */
declare class EntityBase {
    #private;
    /**
     * @type {MinecraftEntityType}
     */
    vanillaEntity: any;
    /**
     * @hideconstructor
     * @param {MinecraftEntityType} entity
     */
    constructor(entity: any);
    /**
     * 检查一个东西是否为实体
     * @param {any} obj - 任意
     * @throws 当不是实体的时候抛出错误
     */
    static checkIsEntity(obj: any): void;
    /**
     * 从一个实体中获得YoniEntity
     * @param {any} entity - 可以被认为是实体的东西
     * @return {YoniEntityType|null} 如果无法获得，返回null
     */
    static from(entity: any): any;
    /**
     * 检测某个实体是否为玩家
     * @param {EntityType} entity 要检测的实体
     * @returns {Boolean}
     * @throws 当参数不是实体时抛出错误
     */
    static entityIsPlayer(entity: any): boolean;
    /**
     * 获取所有存活的实体
     * @param {Minecraft.EntityQueryOptions} option
     * @return {YoniEntityType[]}
     */
    static getAliveEntities(option: any): any;
    /**
     * 获取实体的minecraft:health组件
     * @param {EntityType} entity
     * @returns {Minecraft.EntityHealthComponent}
     */
    static getHealthComponent(entity: any): any;
    /**
     * 获取实体的物品栏
     * @param {EntityType} entity
     * @returns {Minecraft.InventoryComponentContainer}
     */
    static getInventory(entity: any): any;
    /**
     * 获取实体的血量
     * @param {EntityType} entity
     * @returns {number}
     */
    static getCurrentHealth(entity: any): any;
    /**
     * @param {import('.../Location.js').DimensionLike}
     * @param {Minecraft.EntityQueryOptions} [options]
     */
    static getDimensionEntities(dimension: any, options: any, optionClass?: any): any;
    /**
     * @param {import('.../Location.js').DimensionLike}
     * @param {Minecraft.EntityQueryOptions} [options]
     */
    static getWorldPlayers(options: any, optionClass?: any): any;
    /**
     * 获取所有存在的实体（包括死亡的玩家）
     * @returns {EntityType[]}
     */
    static getLoadedEntities(): any;
    /**
     * 获取实体最大血量
     * @param {EntityType} entity
     * @returns {number}
     */
    static getMaxHealth(entity: any): any;
    /**
     * 得到一个Minecraft.Entity
     * @param {EntityType} entity
     * @returns {MinecraftEntityType|null}
     */
    static getMinecraftEntity(entity: any): any;
    /**
     * 得到一个Entity
     * @param {EntityType} entity
     * @returns {YoniEntityType|null}
     * @throws 如果参数不是实体将会抛出错误
     */
    static getYoniEntity(entity: any): any;
    /**
     * 检测一个实体是否有指定的所有种族
     * @param {EntityType} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasFamilies(entity: any, ...families: any[]): boolean;
    /**
     * 检测一个实体是否任一指定的种族
     * @param {EntityType} entity
     * @param {...string} families
     * @returns {boolean}
     */
    static hasAnyFamily(entity: any, ...families: any[]): boolean;
    /**
     * 检测一个实体是否有某个种族
     * @param {EntityType} entity
     * @param {string} family
     * @returns {boolean}
     */
    static hasFamily(entity: any, family: any): boolean;
    /**
     * 检测一个实体是否存在于世界上
     * @param {EntityType} entity
     * @returns {boolean}
     */
    static isAliveEntity(entity: any): any;
    /**
     * 检测一个实体是否活着
     * 物品、箭、烟花等不是活的
     * 死了的实体也不是活的
     * @param {EntityType} entity
     * @returns {boolean}
     */
    static isAlive(entity: any): boolean;
    /**
     * 检测参数是否为实体
     * @param {any} obj
     * @returns {boolean}
     */
    static isEntity(obj: any): boolean;
    /**
     * 检测参数是否为原版实体
     * @param {any} object
     * @returns {boolean}
     */
    static isMinecraftEntity(object: any): boolean;
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
    static isYoniEntity(object: any): boolean;
    /**
     * 设置实体的血量
     * @param {EntityType} entity
     * @param {number} val
     */
    static setCurrentHealth(entity: any, val: any): void;
}
export { EntityBase };
