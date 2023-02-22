import { Minecraft } from "./basis.js";
import Location from "./Location.js";
import { YoniDimension } from "./dimension.js";
declare class Block {
    static isBlock(object: any): boolean;
    static from(block: Minecraft.Block): Block;
    readonly vanillaBlock: Minecraft.Block;
    readonly location: Location;
    readonly dimension: YoniDimension;
    /**
     * @param {Minecraft.Block}
     */
    constructor(vanillaBlock: Minecraft.Block);
}
declare type YoniBlock = Block & Minecraft.Block;
export { Block, YoniBlock };
export default Block;
