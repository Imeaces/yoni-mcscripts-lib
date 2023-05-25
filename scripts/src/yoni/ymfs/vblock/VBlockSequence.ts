import { Volume } from "../disk/Volume.js";
import { Chunk } from "../disk/Chunk.js";

class VBlockSequence {
    static * iterateVolumeChunks(volume: Volume): Iterator<Chunk> {
    }
    static createVBlockSequence(volume: Volume, blocksInGroup: number, startIndex: number = 0){
        for (let i = startIndex; i < volume.size; i++){
            const chunk = volume.getChunk(i);
            for (let ci = 0; ci 
        }
        const iterator = VBlockSequence.iterateVolumeChunks(volume);
        
        for (const chunk of iterateVolumeChunks){
        }
        const chunkIteratorFunc = function * (){
        }
    }
}

0xffffffff
0b11111111111111111111111111111111

0x12345678
0b00010010001101000101011001111000