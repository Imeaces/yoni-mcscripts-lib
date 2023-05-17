import { Chunk } from "../disk/Chunk.js";

export class YmFSChunk {
    static cleanChunkData(chunk: Chunk){
        for (let index = 0; index < chunk.size; index++){
            chunk.getBlock(index).setDataStr("");
        }
    }
    chunk: Chunk;
    constructor(chunk: Chunk){
        this.chunk = chunk;
    }
    getDataStr(index: number){
        return this.chunk.getBlock(index).getDataStr();
    }
    setDataStr(index: number, data: string){
        this.chunk.getBlock(index).setDataStr(data);
    }
    getData(index: number, data?: ArrayBuffer){
        return this.chunk.getBlock(index).getData(data);
    }
    setData(index: number, data: ArrayBuffer){
        this.chunk.getBlock(index).setData(data);
    }
}
