import { Minecraft } from "./basis.js";
import Scoreboard from "./scoreboard.js";
import { Entity, Player } from "./entity.js";
declare class World {
    static isWorld(object: any): boolean;
    readonly vanillaWorld: Minecraft.World;
    get scoreboard(): typeof Scoreboard;
    /**
     * @param {Minecraft.World}
     */
    constructor(vanillaWorld: Minecraft.World);
    /**
     * 查找游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {Player}
     */
    selectPlayers<Player>(options: Minecraft.EntityQueryOptions): Generator<Player, void, unknown>;
    /**
     * 查找游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} [option]
     * @yields {Player}
     */
    getPlayers<Player>(option?: Minecraft.EntityQueryOptions): Generator<Player, void, unknown>;
    /**
     * 获取与 `dimid` 对应的维度对象。
     * @param {string|number} dimid
     * @returns {Dimension}
     */
    getDimension(dimid: string | number): import("./dimension.js").YoniDimension;
    /**
     * 获取一个游戏中的所有玩家的对象。
     * @returns {Player[]} 一个包含了游戏中所有玩家的对象的数组。
     */
    getAllPlayers(): Player[];
    /**
     * 获取一个包含了当前世界中已经加载的所有实体的对象的数组。
     */
    getLoadedEntities(): Entity[];
    /**
     * 查找游戏中符合特定条件的实体。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {Entity}
     */
    selectEntities<Entity>(option: Minecraft.EntityQueryOptions): Generator<Entity, void, unknown>;
    getAliveEntities(): Entity[];
}
declare type YoniWorld = World & Minecraft.World;
declare const world: World;
export { world as World, YoniWorld };
export default World;
