import Scoreboard from "./scoreboard.js";
/**
 * @typedef {import("./entity.js").YoniEntity} Entity
 * @typedef {import("./entity.js").YoniPlayer} Player
 */
/**
 * 代表一种与世界的关系。
 */
declare class World {
    #private;
    static get instance(): null;
    /**
     * @private
     * @hideconstructor
     */
    constructor();
    /**
     * 获取一个包含了游戏中的所有玩家的对象的数组。
     * @yields {Player}
     */
    selectPlayers(options: any): Generator<any, void, unknown>;
    /**
     * @ignore
     */
    selectEntities(options: any): void;
    /**
     * 获取一个包含了游戏中的所有玩家的对象的数组。
     * @returns {Player[]}
     */
    getPlayers(): any[];
    /**
     */
    getAllPlayers(): any[];
    /**
     * 获取一个包含了当前世界中已经加载的所有实体的对象的数组。
     * @returns {Entity[]}
     */
    getLoadedEntities(): any[];
    getAliveEntities(): any[];
    get scoreboard(): typeof Scoreboard;
    get getDimension(): (dimid?: number) => any;
}
export default World;
export { World };
