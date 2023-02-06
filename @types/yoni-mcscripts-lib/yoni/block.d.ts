export class Block {
    static isBlock(object: any): boolean;
    /**
     * @param {Minecraft.Block}
     */
    constructor(...args: any[]);
    get location(): any;
    vanillaBlock: any;
}
export default Block;
