import { Minecraft } from "../basis.js";
import { YoniBlock } from "../block.js";
import { Location } from "../Location.js";
import { ChunkBlock } from "./ChunkBlock.js";
import { Volume } from "./Volume.js";

export class Chunk {
    location: Readonly<Location>;
    mblock: YoniBlock;
    mcontainer: Minecraft.Container;
    index: number;
    volume: Volume;
    get size(){
        return this.mcontainer.size;
    }
    constructor(volume: Volume, index: number, location: Location){
        this.volume = volume;
        this.index = index;
        this.location = Location.makeReadonly(location);
        this.mblock = this.location.getBlock();
        let inventory = this.mblock.getComponent("minecraft:inventory") as Minecraft.BlockInventoryComponent;
        if (inventory == null)
            throw new Error("chunk mblock inventory not found");
        this.mcontainer = inventory.container;
    }
    getBlock(index: number){
        if (index < 0
        || index >= this.size
        || Math.floor(index) !== index)
            throw new RangeError("no block at the index "+index);
        
        let block = new ChunkBlock(this, index);
        
        return block;
    }
}
