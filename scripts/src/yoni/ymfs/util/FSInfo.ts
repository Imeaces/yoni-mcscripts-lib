import { YmFSSuperChunk } from "../chunk/YmFSSuperChunk.js";

export class YmFS_FSInfo {
    #chunk: YmFSSuperChunk;
    #totalChunkCount: number;
    #rootDirectoryChunkIndex: number;
    get totalChunkCount(): number {
        return this.#totalChunkCount;
    }
    get rootDirectoryVBlock(): number {
        return this.#rootDirectoryChunkIndex;
    }
    set rootDirectoryVBlock(index) {
        this.#rootDirectoryChunkIndex = index;
    }
    constructor(chunk: YmFSSuperChunk){
        this.#chunk = chunk;
        const fsinfoArr = chunk.getDataStr(2)
            .split("\u0000")
            .map(Number);
        this.#totalChunkCount = fsinfoArr[0];
        this.#rootDirectoryChunkIndex = fsinfoArr[1];
    }
}
