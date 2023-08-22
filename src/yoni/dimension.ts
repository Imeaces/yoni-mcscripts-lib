import { VanillaWorld, Minecraft } from "./basis.js";

import { Location } from "./Location.js";

import type { YoniEntity, YoniPlayer } from "./entity.js";

import { LocationParamsOneArg, Vector3 } from "./Location.js";
import { DimensionLikeValue } from "./dim.js";

import { YoniBlock, Block } from "./block.js";
import { EntityBase } from "./entity/EntityBase.js";
import { Command } from "./command.js";

import { DimensionValues } from "./dim.js";

/**
 * 代表维度，一种世界内的空间。
 */
class Dimension {
    static #dimensionMappings = new Map<any, Dimension>();
    
    static toDimension(dimid: DimensionLikeValue): Dimension {
    
        //使用缓存加快异型参数处理速度
        let result = Dimension.#dimensionMappings.get(dimid);
        if (result){
            return result;
        }
        
        let vanilla: Minecraft.Dimension | null = null;
        if (typeof dimid === "string" || typeof dimid === "number"){
            vanilla = DimensionValues[dimid];
            if (vanilla == null){
                //此处可能抛出错误，如果参数错误的话
                vanilla = VanillaWorld.getDimension(dimid as string);
            }
        } else if (dimid instanceof Dimension){
            return dimid;
        } else if (dimid instanceof Minecraft.Dimension){
            vanilla = dimid;
        }
        
        if (vanilla == null){
            throw new Error("specific identifier doesn't refer to a dimension");
        }
        result = Dimension.#dimensionMappings.get(vanilla);
        if (result === undefined){
            result = new Dimension(vanilla);
            Dimension.#dimensionMappings.set(dimid, result);
            Dimension.#dimensionMappings.set(vanilla, result);
        }
        return result;
    }

    static isDimension(object: any): object is (Minecraft.Dimension | Dimension){
        return object instanceof Minecraft.Dimension || object instanceof Dimension;
    }
    
    // @ts-ignore
    readonly vanillaDimension: Minecraft.Dimension;
    /**
     * Identifier of the dimension.
     * @throws This property can throw when used.
     */
    // @ts-ignore
    readonly id: string;
    
    /**
     * @hideconstructor
     * @param {Minecraft.Dimension}
     */
    protected constructor(vanillaDimension: Minecraft.Dimension){
        Object.defineProperty(this, "vanillaDimension", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaDimension
        });
        Object.defineProperty(this, "id", {
            configurable: true,
            enumerable: false,
            get(){
                return this.vanillaDimension.id;
            },
            set(v: any){
                // @ts-ignore
                this.vanillaDimension.id = v;
            }
        });
    }
    /**
     */
    getBlock(location: LocationParamsOneArg): YoniBlock {
        let loc: Location;
        if (location instanceof Location){
            loc = location;
        } else {
            loc = new Location(location);
        }
        let vanillaBlock = this.vanillaDimension.getBlock(loc.getVanillaBlockLocation());
        if (vanillaBlock)
            return Block.from(vanillaBlock);
        else
            throw new Error("This location has not been loaded\n"+loc.toString());
    }
    /**
     */
    getBlockFromRay(location: Vector3, direction: Vector3, options?: Minecraft.BlockRaycastOptions) {
        return Block.from(this.vanillaDimension.getBlockFromRay(new Location(location).getVanillaLocation(), new Location(direction).getVanillaVector(), options));
    }
    /**
     */
    getEntities(options?: Partial<Minecraft.EntityQueryOptions>): YoniEntity[] {
        return Array.from(this.vanillaDimension.getEntities(Object.assign(new Minecraft.EntityQueryOptions, options))).map(EntityBase.from) as unknown as YoniEntity[];
    }
    /**
     */
    getEntitiesAtBlockLocation(location: Vector3): YoniEntity[] {
        return this.vanillaDimension.getEntitiesAtBlockLocation(new Location(location).getVanillaBlockLocation())
            .map(EntityBase.from) as unknown as YoniEntity[];
    }
    /**
     */
    getEntitiesFromRay(location: Vector3, direction: Vector3, options?: Minecraft.EntityRaycastOptions): YoniEntity[] {
        return this.vanillaDimension.getEntitiesFromRay(new Location(location).getVanillaLocation(), new Location(direction).getVanillaVector(), options)
            .map(EntityBase.from) as unknown as YoniEntity[];
    }
    /**
     */
    getPlayers(option?: Partial<Minecraft.EntityQueryOptions>): YoniPlayer[] {
        return Array.from(this.vanillaDimension.getPlayers(Object.assign(new Minecraft.EntityQueryOptions, option))).map(EntityBase.from) as unknown as YoniPlayer[];
    }
    fetchCommand(commandString: string){
        return Command.fetchExecute(this.vanillaDimension, commandString);
    }
    /**
     */
    spawnEntity(identifier: string, location: Vector3): YoniEntity {
        return EntityBase.from(this.vanillaDimension.spawnEntity(identifier, new Location(location).getVanillaLocation())) as YoniEntity;
    }
    /**
     */
    spawnItem(item: Minecraft.ItemStack, location: Vector3): YoniEntity {
        return EntityBase.from(this.vanillaDimension.spawnItem(item, new Location(location).getVanillaLocation())) as YoniEntity;
    }
}

type RemovedKeys = never
type OverridedKeys = "id" | "getBlock" | "getBlockFromRay" | "getEntities" | "getEntitiesAtBlockLocation" | "getEntitiesFromRay" | "getPlayers" | "spawnEntity" | "spawnItem"
type BaseVanillaDimensionClass = 
    Omit<
        Minecraft.Dimension,
        RemovedKeys | OverridedKeys
    >;
interface Dimension extends BaseVanillaDimensionClass {
}

export { Dimension, Dimension as YoniDimension };
