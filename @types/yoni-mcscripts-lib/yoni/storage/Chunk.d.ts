import { Minecraft } from "../basis.js";
import { YoniBlock } from "../block.js";
import { Location } from "../Location.js";
import { ChunkBlock } from "./ChunkBlock.js";
export declare class Chunk {
    #private;
    location: Readonly<Location>;
    mblock: YoniBlock;
    mcontainer: Minecraft.Container;
    get size(): number;
    constructor(location: Location);
    getBlock(index: number): ChunkBlock;
}
