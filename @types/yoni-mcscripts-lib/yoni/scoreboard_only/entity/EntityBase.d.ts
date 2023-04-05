import { EntityValue } from "./EntityTypeDefs.js";
import { Minecraft } from "../basis.js";
export declare class EntityBase {
    static isEntity(one: any): one is EntityValue;
    static isMinecraftEntity(one: any): one is EntityValue;
    static entityIsPlayer(one: EntityValue): one is Minecraft.Player;
    /**
     * 检查一个东西是否为实体
     * @param {any} object - 任意
     * @throws 当不是实体的时候抛出错误
     */
    static checkIsEntity(object: any): void;
    /**
     * 得到一个Minecraft.Entity
     * @param {EntityValue} entity
     * @returns {MinecraftEntityType}
     */
    static getMinecraftEntity(entity: EntityValue): Minecraft.Entity;
}
