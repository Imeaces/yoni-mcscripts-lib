import { VanillaWorld, Minecraft } from "./basis.js";
import { getAllDims } from "./dim.js";
import { EntityBase } from "./entity.js";
import { Scoreboard } from "./scoreboard.js";
import { Dimension } from "./dimension.js";
import { copyPropertiesWithoutOverride } from "./lib/ObjectUtils.js";

import { YoniEntity, YoniPlayer } from "./entity.js";

class World {
    static isWorld(object: any){
        return object instanceof Minecraft.World || object instanceof World;
    }
    
    //@ts-ignore
    readonly vanillaWorld: Minecraft.World;
    get scoreboard(){
        return Scoreboard;
    }
    /**
     * @param {Minecraft.World}
     */
    constructor(vanillaWorld: Minecraft.World){
        Object.defineProperty(this, "vanillaWorld", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaWorld
        });
    }
    /**
     * @deprecated 自从返回结果改为数组之后，这方法就没有意义了。
     * 查找游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {YoniPlayer}
     */
    * selectPlayers(options: Minecraft.EntityQueryOptions): Generator<YoniPlayer> {
        for (let pl of VanillaWorld.getPlayers(options)){
            yield EntityBase.from(pl) as unknown as YoniPlayer;
        }
    }
    /**
     * 获取游戏中符合特定条件的玩家。
     * @param {Minecraft.EntityQueryOptions} [option]
     * @yields {YoniPlayer}
     */
    getPlayers(option?: Minecraft.EntityQueryOptions): Array<YoniPlayer> {
        return EntityBase.getWorldVanillaPlayers(option).map(EntityBase.from) as Array<YoniPlayer>;
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
        return EntityBase.getLoadedVanillaEntities()
        .map(ent => EntityBase.from(ent) as unknown as YoniEntity);
    }
    /**
     * @deprecated 自从返回结果改为数组之后，这方法就没有意义了。
     * 查找游戏中符合特定条件的实体。
     * @param {Minecraft.EntityQueryOptions} options
     * @yields {YoniEntity}
     */
    * selectEntities(option: Minecraft.EntityQueryOptions): Generator<YoniEntity> {
        for (let d of getAllDims()){
            for (let entity of d.getEntities(option)){
                yield EntityBase.from(entity) as unknown as YoniEntity;
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
