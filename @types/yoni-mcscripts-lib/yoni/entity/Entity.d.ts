import { EntityBase } from "./EntityBase.js";
/**
 * @typedef {Entity|Player|SimulatedPlayer} YoniEntityType
 * @typedef {Minecraft.Player|Minecraft.Entity|import("../basis.js").Gametest.SimulatedPlayer} MinecraftEntityType
 * @typedef {YoniEntityType|MinecraftEntityType} EntityType
 */
/**
 * 代表一个实体
 */
declare class Entity extends EntityBase {
    get [Symbol.toStringTag](): string;
    get id(): number;
    get typeId(): string;
    get velocity(): any;
    get entityType(): {};
}
export default Entity;
export { Entity };
