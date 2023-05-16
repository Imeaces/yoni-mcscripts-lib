import { Minecraft } from "../../basis.js";
import { Chunk } from "./Chunk.js";

export class ChunkBlock {
    chunk: Chunk;
    index: number;
    constructor(chunk: Chunk, index: number){
        this.chunk = chunk;
        this.index = index;
    }
    
    /**
     * 将字符串写入到此对象代表的块。
     * @param {string} dataStr - 要存储在此块上的数据字符串。
     */
    setDataStr(dataStr: string){
        this.chunk.setDataStr(this.index, dataStr);
    }
    /**
     * 读取块上存入的字符串。
     * @returns {string} 此块上存储的数据字符串。
     */
    getDataStr(){
        return this.chunk.getDataStr(this.index);
    }
    
    /**
     * 将数据写入到此对象代表的块。
     * @param {ArrayBuffer} buffer - 要存储在此块上的数据。
     */
    setData(buffer: ArrayBuffer){
        this.chunk.setData(this.index, buffer);
    }
    
    /**
     * 读取块上的数据。
     * @param {ArrayBuffer} [buffer] - 若指定，将此块上的数据写入此缓冲区。
     * @returns {ArrayBuffer} 此块上存储的数据。
     */
    getData(buffer?: ArrayBuffer): ArrayBuffer {
        return this.chunk.getData(this.index, buffer);
    }
}
