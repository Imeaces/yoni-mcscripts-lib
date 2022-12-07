export default Entity;
export class SimulatedPlayer extends Player {
}
export class Player extends Entity {
    /**
     * 踢出玩家
     */
    kick(msg: any): Promise<void>;
    sendMessage(message: any): any;
    sendRawMessage(rawtext: any): any;
}
export class Entity {
    /**
     * 检查一个东西是否为实体
     * @param 任意
     * @throws 当不是实体的时候抛出错误
     */
    static checkIsEntity(obj: any): void;
    /**
     * 从一个实体中获得YoniEntity
     * @param 可以被认为是实体的东西
     * @return {Entity} 如果无法获得，返回null
     */
    static from(entity: any): Entity;
    /**
     * 检测某个实体是否为
     * @param 要检测的实体
     * @return {Boolean}
     * @throws 当参数不是实体时抛出错误
     */
    static entityIsPlayer(entity: any): boolean;
    /**
     * 获取所有存活的实体
     * @param {Minecraft.EntityQueryOptions}
     * @return {Entity[]}
     */
    static getAliveEntities(...args: any[]): Entity[];
    static getHealthComponent(entity: any): any;
    static getInventory(entity: any): any;
    /**
     * 获取实体的血量
     */
    static getCurrentHealth(entity: any): any;
    /**
     * 获取所有存在的实体（包括死亡的玩家）
     * @param {Minecraft.EntityQueryOptions}
     * @return {Entity[]}
     */
    static getLoadedEntities(...args: any[]): Entity[];
    /**
     * 获取实体最大血量
     */
    static getMaxHealth(entity: any): any;
    /**
     * 得到一个Minecraft.Entity
     * @param entity
     * @returns <? extends Minecraft.Entity>
     */
    static getMinecraftEntity(entity: any): any;
    /**
     * 得到一个Entity，如果无法根据参数得到一个Entity将会抛出错误
     * @param entity
     * @returns <? extends Entity>
     */
    static getYoniEntity(entity: any): Entity;
    /**
     * 检测一个实体是否有某个种族
     * 由于无法同步执行命令，只能用其他方法来检测了
     * 性能不确定
     */
    static hasAnyFamily(entity: any, ...families: any[]): boolean;
    /**
     * 检测一个实体是否有某个种族
     */
    static hasFamily(entity: any, family: any): boolean;
    /**
     * 检测一个实体是否存在于世界上
     */
    static isAliveEntity(entity: any): boolean;
    /**
     * 检测一个实体是否活着
     * 物品、箭、烟花等不是活的
     * 死了的实体也不是活的
     */
    static isAlive(entity: any): boolean;
    /**
     * 检测参数是否为实体
     */
    static isEntity(obj: any): boolean;
    /**
     * 检测参数是否为原版实体
     */
    static isMinecraftEntity(object: any): boolean;
    /**
     * 检测两个参数是否为同一实体
     */
    static isSameEntity(ent1: any, ent2: any): boolean;
    /**
     * 检测参数是否为YoniEntity
     * @param any
     */
    static isYoniEntity(object: any): boolean;
    /**
     * 获取实体的血量
     */
    static setCurrentHealth(entity: any, val: any): void;
    constructor(entity: any, symbol: any);
    get entityType(): any;
    get typeid(): any;
    vanillaEntity: any;
    getMinecraftEntity(): any;
    get location(): any;
    get uniqueId(): any;
    get scoreboard(): any;
    isAliveEntity(): boolean;
    isAlive(): boolean;
    getCurrentHealth(): any;
    getHealthComponent(): any;
    getInventory(): any;
    getMaxHealth(): any;
    hasFamily(family: any): boolean;
    hasAnyFamily(...families: any[]): boolean;
    fetchCommand(cmd: any): any;
    say(message: any): any;
    setCurrentHealth(v: any): void;
    /**
     * 传入位置，将实体传送到指定位置
     * 允许两种长度的参数
     * 当传入了1个参数，被认为是yoni的方法
     * 当传入了2个参数，被认为是yoni的方法
     * 当传入了4个参数，被认为是原版的方法
     * 当传入了5个参数，被认为是原版的方法
     * yoni方法中，第一个参数认为是位置，第二个参数认为是keepVelocity
     * 原版方法中参数顺序为[location, dimension, rx, ry, keepVelocity?=null]
     */
    teleport(args: any): void;
}
export { SimulatedPlayer as YoniSimulatedPlayer, Player as YoniPlayer, Entity as YoniEntity };
