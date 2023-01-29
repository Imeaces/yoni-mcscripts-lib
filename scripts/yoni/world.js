// @ts-nocheck
import { VanillaWorld, dim, Minecraft } from "./basis.js";
import { EntityBase } from "./entity.js";
import Scoreboard from "./scoreboard.js";
import { copyPropertiesWithoutOverride, assignAllPropertiesWithoutOverride } from "./lib/ObjectUtils.js";
/**
 * @typedef {import("./entity.js").YoniEntity} Entity
 * @typedef {import("./entity.js").YoniPlayer} Player
 */
/**
 * 代表一种与世界的关系。
 */
class World {
    static #instance = null;
    static get instance() {
        if (!World.#instance)
            World.#instance = new World();
        return World.#instance;
    }
    /**
     * @private
     * @hideconstructor
     */
    constructor() {
        if (World.#instance)
            throw new TypeError("not a constructor");
    }
    /**
     * 获取一个包含了游戏中的所有玩家的对象的数组。
     * @yields {Player}
     */
    *selectPlayers(options) {
        for (let pl of VanillaWorld.getPlayers(options)) {
            yield EntityBase.from(pl);
        }
    }
    /**
     * @ignore
     */
    selectEntities(options) {
        throw new RefrenceError("not implemented");
    }
    /**
     * 获取一个包含了游戏中的所有玩家的对象的数组。
     * @returns {Player[]}
     */
    getPlayers() {
        return Array.from(VanillaWorld.getPlayers()).map(EntityBase.from);
    }
    /**
     */
    getAllPlayers() {
        return this.getPlayers();
    }
    /**
     * 获取一个包含了当前世界中已经加载的所有实体的对象的数组。
     * @returns {Entity[]}
     */
    getLoadedEntities() {
        return Object.getOwnPropertyNames(Minecraft.MinecraftDimensionTypes)
            .map(dimid => dim(dimid))
            .map(dim => Array.from(dim.getEntities))
            .flat()
            .map(ent => EntityBase.from(ent));
    }
    getAliveEntities() {
        return this.getLoadedEntities()
            .filter((ent) => ent.isAlive());
    }
    get scoreboard() {
        return Scoreboard;
    }
    get getDimension() {
        return dim;
    }
}
const VanillaWorldSymbol = Symbol("VanillaWorld");
World[VanillaWorldSymbol] = VanillaWorld;
copyPropertiesWithoutOverride(World.prototype, Minecraft.World.prototype, VanillaWorldSymbol);
assignAllPropertiesWithoutOverride(World, World.instance);
export default World;
export { World };
