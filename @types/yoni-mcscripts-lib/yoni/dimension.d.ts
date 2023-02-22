import { Minecraft } from "./basis.js";
import { Location1Arg } from "./Location.js";
import { Block } from "./block.js";
declare class Dimension {
    #private;
    static dim(dimid: string | number | Dimension | Minecraft.Dimension | YoniDimension): YoniDimension;
    static isDimension(object: any): object is (Minecraft.Dimension | YoniDimension);
    readonly vanillaDimension: Minecraft.Dimension;
    /**
     * @param {Minecraft.Dimension}
     */
    constructor(vanillaDimension: Minecraft.Dimension);
    getBlock(location: Location1Arg): Block;
}
declare type YoniDimension = Dimension & Minecraft.Dimension;
export { Dimension, YoniDimension };
export default Dimension;
