import { Minecraft } from "./basis.js";
import { Location, Vector3 } from "./Location.js";
import { YoniDimension } from "./dimension.js";

class Block {
    static isBlock(object: any): object is (Minecraft.Block | Block) {
        return object instanceof Minecraft.Block || object instanceof Block;
    }
    static from(block: Minecraft.Block): Block {
        if (block == null)
            throw new TypeError("null object");
        return new Block(block) as unknown as Block;
    }
    
    // @ts-ignore
    readonly vanillaBlock: Minecraft.Block;
    /**
     * Returns the dimension that the block is within.
     */
    // @ts-ignore
    readonly location: Readonly<Location>;
    // @ts-ignore
    readonly dimension: YoniDimension;
    /**
     * X coordinate of the block.
     */
    // @ts-ignore
    readonly x: number;
    /**
     * Y coordinate of the block.
     */
    // @ts-ignore
    readonly y: number;
    /**
     * Z coordinate of the block.
     */
    // @ts-ignore
    readonly z: number;
    /**
     * @param {Minecraft.Block}
     */
    constructor(vanillaBlock: Minecraft.Block){
        let location = Location.createReadonly(vanillaBlock);
        let { x, y, z, dimension } = location;
        Object.defineProperties(this, {
            "vanillaBlock": {
                configurable: false,
                enumerable: false,
                writable: false,
                value: vanillaBlock
            },
            "location": {
                configurable: true,
                enumerable: false,
                writable: false,
                value: location
            },
            "dimension": {
                configurable: true,
                enumerable: false,
                writable: false,
                value: dimension
            },
            "x": {
                configurable: true,
                enumerable: false,
                writable: false,
                value: x
            },
            "z": {
                configurable: true,
                enumerable: false,
                writable: false,
                value: z
            },
            "y": {
                configurable: true,
                enumerable: false,
                writable: false,
                value: y
            },
        });
    }
}

type RemovedKeys = never
type OverridedKeys = keyof Vector3 | "dimension" | "location"
type BaseVanillaBlockClass = 
    Omit<
        Minecraft.Block,
        RemovedKeys | OverridedKeys
    >;
interface Block extends BaseVanillaBlockClass {
}

export { Block, Block as YoniBlock };
