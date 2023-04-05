import { Minecraft } from "../basis.js";
import { YoniBlock } from "../block.js";
import { Location } from "../Location.js";
import { ChunkBlock } from "./ChunkBlock.js";
import { Volume } from "./Volume.js";
export declare class Chunk {
    location: Readonly<Location>;
    mblock: YoniBlock;
    mcontainer: Minecraft.Container;
    index: number;
    volume: Volume;
    get size(): number;
    constructor(volume: Volume, index: number, location: Location);
    getBlock(index: number): ChunkBlock;
}
