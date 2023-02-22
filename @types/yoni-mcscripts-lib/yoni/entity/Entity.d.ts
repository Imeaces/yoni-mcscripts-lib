import { Minecraft } from "../basis.js";
import { Location } from "../Location.js";
import { EntityBase } from "./EntityBase.js";
/**
 * @typedef {Entity|Player|SimulatedPlayer} YoniEntityType
 * @typedef {Minecraft.Player|Minecraft.Entity|import("../basis.js").Gametest.SimulatedPlayer} MinecraftEntityType
 * @typedef {YoniEntityType|MinecraftEntityType} EntityType
 */
/**
 * 代表一个实体
 */
declare class Entity extends EntityBase implements Minecraft.Entity {
    get [Symbol.toStringTag](): string;
    get id(): string;
    get typeId(): string;
    get velocity(): Minecraft.Vector;
    get entityType(): Minecraft.EntityType;
    get dimension(): Minecraft.Dimension;
    getMinecraftEntity(): import("./EntityTypeDefs.js").MinecraftEntityType;
    get location(): Location;
    get uniqueId(): string;
    get scoreboard(): any;
    isAliveEntity(): any;
    isAlive(): boolean;
    getCurrentHealth(): number;
    getHealthComponent(): any;
    getInventory(): Minecraft.InventoryComponentContainer;
    getMaxHealth(): any;
    /**
     * @param {string} family
     */
    hasFamily(family: any): boolean;
    /**
     *
     * @param  {...string} families
     * @returns
     */
    hasAnyFamily(...families: any[]): boolean;
    /**
     *
     * @param {string} cmd
     * @returns {Promise<Minecraft.CommandResult>}
     */
    fetchCommand(cmd: any): Promise<import("../command.js").CommandResult>;
    /**
     * @param {string} message
     */
    say(message: any): Promise<import("../command.js").CommandResult>;
    /**
     * @param {number} v
     */
    setCurrentHealth(v: any): void;
    /**
     * 传入位置，将实体传送到指定位置
     * 允许两种长度的参数，由于此特性，补全提示可能会出现一些错误，已在补全中尝试修复。
     * 当传入了1个参数，被认为是yoni的方法
     * 当传入了2个参数，被认为是yoni的方法
     * 当传入了4个参数，被认为是原版的方法
     * 当传入了5个参数，被认为是原版的方法
     * yoni方法中，第一个参数认为是位置，第二个参数认为是keepVelocity
     * 原版方法中参数顺序为[location, dimension, rx, ry, keepVelocity?=null]
     * 所以你可以直接传入实体对象、方块对象、或者普通位置对象，或者接口
     * @param {import("./Location.js").Location1Arg|Minecraft.Vector3} argLocation
     * @param {Minecraft.Dimension} [argDimension]
     * @param {number} [argRx]
     * @param {number} [argRy]
     * @param {boolean} [keepVelocity]
     */
    teleport(...args: [import("./Location.js").Location1Arg | Minecraft.Vector3] | [import("./Location.js").Location1Arg | Minecraft.Vector3, boolean]): void;
}
declare type YoniEntity = Entity & Minecraft.Entity;
export default YoniEntity;
export { YoniEntity, Entity };
