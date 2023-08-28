import { VanillaWorld, Minecraft } from "../basis.js";
import { Location } from "./Location.js";
import { EntityUtils } from "../EntityUtils.js";
import { Command } from "../command.js";
import { DimensionValues } from "../dimensionutils.js";
import type { DimensionLikeValue } from "../dimensionutils.js";
import type { YoniEntity, YoniPlayer } from "./entity/index.js";
import type { LocationParamsOneArg, Vector3 } from "./Location.js";

/**
 * 代表维度，一种世界内的空间。
 */
class Dimension {
    static #dimensionMappings = new Map<any, Dimension>();
    
    static isDimensionValue(value: any): boolean {
        return value != null && (
            value instanceof Minecraft.Dimension
            || value instanceof Dimension
            || value in DimensionValues);
    }
    
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
     * 获取指定位置上的方块对象。
     */
    getBlock(location: LocationParamsOneArg): Minecraft.Block {
        let loc: Location;
        if (location instanceof Location){
            loc = location;
        } else {
            loc = new Location(location);
        }
        let vanillaBlock = this.vanillaDimension.getBlock(loc.getVanillaBlockLocation());
        if (vanillaBlock)
            return vanillaBlock;
        else
            throw new Error("This location has not been loaded\n"+loc.toString());
    }
    getEntities(options?: Minecraft.EntityQueryOptions): YoniEntity[] {
        return this.vanillaDimension.getEntities(options).map(EntityUtils.from) as unknown as YoniEntity[];
    }
    getEntitiesAtBlockLocation(location: Vector3): YoniEntity[] {
        return this.vanillaDimension.getEntitiesAtBlockLocation(location)
            .map(EntityUtils.from) as unknown as YoniEntity[];
    }
    getEntitiesFromRay(location: Vector3, direction: Vector3, options?: Minecraft.EntityRaycastOptions): YoniEntity[] {
        return this.vanillaDimension.getEntitiesFromRay(location, direction, options)
            .map(EntityUtils.from) as unknown as YoniEntity[];
    }
    getPlayers(option?: Minecraft.EntityQueryOptions): YoniPlayer[] {
        return this.vanillaDimension.getPlayers(option).map(EntityUtils.from) as unknown as YoniPlayer[];
    }
    fetchCommand(commandString: string){
        return Command.fetchExecute(this.vanillaDimension, commandString);
    }
    spawnEntity(identifier: string, location: Vector3): YoniEntity {
        return EntityUtils.from(this.vanillaDimension.spawnEntity(identifier, location)) as YoniEntity;
    }
    spawnItem(item: Minecraft.ItemStack, location: Vector3): YoniEntity {
        return EntityUtils.from(this.vanillaDimension.spawnItem(item, location)) as YoniEntity;
    }
}

type RemovedKeys = never
type OverridedKeys = "id" | "getBlock" | "getEntities" | "getEntitiesAtBlockLocation" | "getEntitiesFromRay" | "getPlayers" | "spawnEntity" | "spawnItem"
type BaseVanillaDimensionClass = 
    Omit<
        Minecraft.Dimension,
        RemovedKeys | OverridedKeys
    >;
interface Dimension extends BaseVanillaDimensionClass {
}

export { Dimension, Dimension as YoniDimension };
