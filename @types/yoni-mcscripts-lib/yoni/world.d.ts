import { Minecraft } from "./basis.js";
import Scoreboard from "./scoreboard.js";
import { Dimension } from "./dimension.js";
import { YoniEntity } from "./entity/Entity.js";
import { YoniPlayer } from "./entity/Player.js";
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
     * @yields {YoniPlayer}
     */
    selectPlayers<YoniPlayer>(options: Minecraft.EntityQueryOptions): Generator<YoniPlayer>;
    /**
     * 查找游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} [option]
     * @yields {YoniPlayer}
     */
    getPlayers<YoniPlayer>(option?: Minecraft.EntityQueryOptions): Generator<YoniPlayer, void, unknown>;
    /**
     * 获取与 `dimid` 对应的维度对象。
     * @param {string|number} dimid
     * @returns {Dimension}
     */
    getDimension(dimid: string | number): Dimension;
    /**
     * 获取一个游戏中的所有玩家的对象。
     * @returns {YoniPlayer[]} 一个包含了游戏中所有玩家的对象的数组。
     */
    getAllPlayers(): YoniPlayer[];
    /**
     * 获取一个包含了当前世界中已经加载的所有实体的对象的数组。
     */
    getLoadedEntities(): YoniEntity[];
    /**
     * 查找游戏中符合特定条件的实体。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {YoniEntity}
     */
    selectEntities<YoniEntity>(option: Minecraft.EntityQueryOptions): Generator<YoniEntity, void, unknown>;
    getAliveEntities(): YoniEntity[];
}
declare type YoniWorld = World & Minecraft.World;
declare const world: World;
export { world as World, YoniWorld };
export default World;
