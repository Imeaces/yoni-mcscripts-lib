import { Chunk } from "../disk/Chunk.js";
import { Volume } from "../disk/Volume.js";
import { YmFSChunk } from "../chunk/YmFSChunk.js";
import { YmFSSuperChunk } from "../chunk/YmFSSuperChunk.js";
import { FSChunkType } from "../chunk/FSChunkType.js";

/**
 * 将块初始化为超级块，使用Volume上的信息
 */
export function initializeInfoOfVolume(chunk: Chunk, volume: Volume){
    
    //步骤1，将所有区块的状态设置为空
    let chunkStatStorage: FSChunkType[] = [];
    
    for (let index = 0; index < volume.size; index++){
        chunkStatStorage.push(FSChunkType.EmptyChunkIndex);
    }
    
    if (chunkStatStorage.length < 2)
        throw new Error("Volume space too small");
    
    //将0块状态设置为超级块
    chunkStatStorage[chunk.index] = FSChunkType.SuperChunkIndex;
    
    //创建文件系统信息
    let spblocks: number[] = [chunk.index];
    let spblock0 = spblocks[0];
    let fsinfo = [chunk.index, chunk.index];
    
    let ymfsHeadStr = YmFSSuperChunk.ymfsHeadStr;
    
    let spblockStr = spblocks.join("\u0000");
    
    let fsinfoStr = fsinfo.join("\u0000");
    
    let chunkStat = chunkStatStorage.join("");
    
    //写入信息到超级块
    YmFSChunk.cleanChunkData(chunk);
    
    chunk.getBlock(0).setDataStr(ymfsHeadStr);
    chunk.getBlock(1).setDataStr(spblockStr);
    chunk.getBlock(2).setDataStr(fsinfoStr);
    chunk.getBlock(3).setDataStr(chunkStat);
}
