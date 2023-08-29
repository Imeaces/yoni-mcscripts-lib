import { VanillaWorld, Minecraft } from "../basis.js";
import { getAllVanillaDimensions } from "../dimensionutils.js";
import { EntityUtils } from "../EntityUtils.js";
import { Scoreboard } from "../scoreboard/Scoreboard.js";
import { Dimension } from "./dimension.js";
import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";

import type { YoniEntity, YoniPlayer } from "./entity/index.js";

/**
 * 代表由一系列维度与其环境组成的世界。
 */
class World {
    static isWorld(object: any){
        return object instanceof Minecraft.World || object instanceof World;
    }
    
    readonly vanillaWorld: Minecraft.World = VanillaWorld;
    constructor(vanillaWorld: Minecraft.World){
        Object.defineProperty(this, "vanillaWorld", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaWorld
        });
    }
    
    get scoreboard(){
        return Scoreboard;
    }
    
    /**
     * @deprecated 自从返回结果改为数组之后，这方法就没有意义了。
     * 查找游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {YoniPlayer}
     */
    * selectPlayers(options: Minecraft.EntityQueryOptions): Generator<YoniPlayer> {
        for (let pl of VanillaWorld.getPlayers(options)){
            yield EntityUtils.from(pl) as unknown as YoniPlayer;
        }
    }
    /**
     * 获取游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} [option]
     * @yields {YoniPlayer}
     */
    getPlayers(option?: Partial<Minecraft.EntityQueryOptions>): Array<YoniPlayer> {
        return EntityUtils.getWorldVanillaPlayers(option).map(EntityUtils.from) as Array<YoniPlayer>;
    }
    
    /**
     * 获取与 `dimid` 对应的维度对象。
     * @param {string|number} dimid
     * @returns {Dimension}
     */
    getDimension(dimid: string|number){
        //@ts-ignore
        return Dimension.toDimension(dimid);
    }
    
    /**
     * 获取一个游戏中的所有玩家的对象。
     * @returns {YoniPlayer[]} 一个包含了游戏中所有玩家的对象的数组。
     */
    getAllPlayers(): YoniPlayer[] {
        return Array.from(this.getPlayers());
    }
    
    /**
     * 获取一个包含了当前世界中已经加载的所有实体的对象的数组。
     */
    getLoadedEntities(): YoniEntity[] {
        return EntityUtils.getLoadedVanillaEntities()
        .map(ent => EntityUtils.from(ent) as unknown as YoniEntity);
    }
    /**
     * @deprecated 自从返回结果改为数组之后，这方法就没有意义了。
     * 查找游戏中符合特定条件的实体。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {YoniEntity}
     */
    * selectEntities(option: Partial<Minecraft.EntityQueryOptions>): Generator<YoniEntity> {
        for (let d of getAllVanillaDimensions()){
            for (let entity of d.getEntities(Object.assign(new Minecraft.EntityQueryOptions, option))){
                yield EntityUtils.from(entity) as unknown as YoniEntity;
            }
        }
    }
    /**
     * 获取所有生物实体。
     */
    getLivingEntities(){
        return this.getLoadedEntities()
            .filter((ent) => ent.isLivingEntity());
    }
}
copyPropertiesWithoutOverride(World.prototype, Minecraft.World.prototype, "vanillaWorld");

type RemovedKeys = never
type OverridedKeys = "getDimension" | "getAllPlayers" | "scoreboard" | "getPlayers" | "getEntities"
type BaseVanillaWorldClass = 
    Omit<
        Minecraft.World,
        RemovedKeys | OverridedKeys
    >;
interface World extends BaseVanillaWorldClass {
}

export { World, World as YoniWorld };

export const world = new World(VanillaWorld);
