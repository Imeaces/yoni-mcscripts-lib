import { VanillaWorld, Minecraft } from "./basis.js";
import { Location, Location1Arg } from "./Location.js";
import { DimensionValues } from "./dim.js";
import { copyPropertiesWithoutOverride } from "./lib/ObjectUtils.js";
import { Block } from "./block.js";

class Dimension {
    static #dimMap = new WeakMap();
    static dim(dimid: string|number|Dimension|Minecraft.Dimension|YoniDimension){
        // @ts-ignore
        let t = typeof dimid;
        // @ts-ignore
        let dim;
        // @ts-ignore
        if (t === "string" || t === "number"){
        // @ts-ignore
            dim = DimensionValues[dimid];
            if (dim == null){
                try {
                    // @ts-ignore
                    dim = VanillaWorld.getDimension(dimid);
                } catch (e){
                    // @ts-ignore
                    throw new Error(e);
                }
            }
        } else if (Dimension.isDimension(dimid)){
            dim = VanillaWorld.getDimension(dimid.id);
        }
        
        if (dim == null){
            throw new Error("specific identifier doesn't refer to a dimension");
        }
        let dimV = Dimension.#dimMap.get(dim);
        if (dimV === undefined){
            dimV = new Dimension(dim);
            Dimension.#dimMap.set(dim, dimV);
        }
        return dimV as unknown as YoniDimension;
    }

    static isDimension(object: any): object is (Minecraft.Dimension | YoniDimension){
        return object instanceof Minecraft.Dimension || object instanceof Dimension;
    }
    
    // @ts-ignore
    readonly vanillaDimension: Minecraft.Dimension;
    
    /**
     * @param {Minecraft.Dimension}
     */
    constructor(vanillaDimension: Minecraft.Dimension){
        Object.defineProperty(this, "vanillaDimension", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaDimension
        });
    }
    
    getBlock(location: Location1Arg){
        let loc: Location;
        if (location instanceof Location){
            loc = location;
        } else {
            loc = new Location(location);
        }
        return Block.from(this.vanillaDimension.getBlock(loc.getVanillaBlockLocation()));
    }
}

copyPropertiesWithoutOverride(Dimension.prototype, Minecraft.Dimension.prototype, "vanillaDimension");

type YoniDimension = Dimension & Minecraft.Dimension;

export { Dimension, YoniDimension };
export default Dimension;
