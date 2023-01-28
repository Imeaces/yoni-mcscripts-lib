import Location from "./Location.js";
export declare class Block {
    static isBlock(object: any): boolean;
    get location(): Location;
    /**
     * @param {Minecraft.Block}
     */
    constructor();
}
export default Block;
