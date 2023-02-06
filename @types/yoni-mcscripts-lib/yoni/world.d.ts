import { dim, Minecraft } from "./basis.js";
import Scoreboard from "./scoreboard.js";
import { Entity, Player } from "./entity.js";
/**
 * 代表一种与世界的关系。
 */
declare class WorldClass {
    #private;
    static get instance(): WorldClass;
    /**
     * @private
     * @hideconstructor
     */
    constructor();
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
     * 获取一个包含了游戏中的所有玩家的对象的数组。
     * @returns {Player[]}
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
    get scoreboard(): typeof Scoreboard;
    get getDimension(): typeof dim;
}
declare const world: WorldClass;
export default world;
export { world as World };
