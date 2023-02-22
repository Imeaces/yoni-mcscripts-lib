import { Minecraft } from "./basis.js";
import Location from "./Location.js";
import { YoniDimension } from "./dimension.js";
 
import { copyPropertiesWithoutOverride } from "./lib/ObjectUtils.js";

class Block {
    static isBlock(object: any){
        return object instanceof Minecraft.Block || object instanceof Block;
    }
    static from(block: Minecraft.Block){
        return new Block(block);
    }
    
    // @ts-ignore
    readonly vanillaBlock: Minecraft.Block;
    // @ts-ignore
    readonly location: Location;
    // @ts-ignore
    readonly dimension: YoniDimension;
    
    /**
     * @param {Minecraft.Block}
     */
    constructor(vanillaBlock: Minecraft.Block){
        Object.defineProperty(this, "vanillaBlock", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaBlock
        });
        Object.defineProperty(this, "location", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: Location.createReadonly(vanillaBlock)
        });
        Object.defineProperty(this, "dimension", {
            configurable: false,
            enumerable: false,
            writable: false,
            // @ts-ignore
            value: this.location.dimension
        });
    }
}

copyPropertiesWithoutOverride(Block.prototype, Minecraft.Block.prototype, "vanillaBlock");

type YoniBlock = Block & Minecraft.Block;

export { Block, YoniBlock };
export default Block;
