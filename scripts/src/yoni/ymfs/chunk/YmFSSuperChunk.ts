import { YmFSChunk } from "./YmFSChunk.js";
import { FSChunkType } from "./FSChunkType.js";
import { FSChunkIndex } from "./FSChunkIndex.js";
import { YmFS_FSInfo } from "../util/FSInfo.js";
import { Chunk } from "../disk/Chunk.js";

/**
 * 超级块
 * 
 * Yoni_YmFS
 * 其hex为 59 6F 6E 69 5F 59 6D 46 53
 * 
 * 紧接着应该是一个数字，使用ascii编码阿拉伯数字，代表文件系统的版本
 * 
 * 再然后，应该是分区的总块数，也应使用ascii编码阿拉伯数字
 * 
 * 接着，列举出分区中所有被使用的Chunk
 * 
 * 然后，列举分区中所有被释放而未清除内容的Chunk
 * 
 * 
 * 在第一个Block中，写入如下数据，用于表示这是一个YmFS
 * Yoni_YmFS\u0000${formatVersion}
 * 
 * 第二个Block中，写入这样的数据，代表超级块数据存储使用的块
 * $Chunk(0)\u0000$Chunk(1)
 * 
 * 第三个Block中，写入一些载入文件系统需要的信息
 * 比如总块数，根目录块的Index
 * $count($Chunks)\u0000$Chunk($(RootDirectory->NormalChunk))
 * 
 * 第四个块中，写入类似于这样的数据
 * 0 EmptyChunkIndex
 * 1 SuperChunkIndex
 * 2 DataChunkIndex
 * 3 NormalChunkIndex
 * 4 DeletedChunkIndex
 * 
 * 6464631649466449481643766161616545

已删除区块地址使用Set存储
使用Array存储未使用的区块，使用reverse ()后的数组，并使用pop()取出区块
是否需要存储已使用的区块？
 */
export class YmFSSuperChunk extends YmFSChunk {

    fsinfo: YmFS_FSInfo;
    spblocks: FSChunkIndex[];
    static ymfsHeadStr = "Yoni_YmFS\u00001";
    /**
     * 为指定块设置状态，并更新记录。
     *
     * 将状态设置为被占用类型时，不会从可用块记录移除特定块。
     */
    setStat(index: number, value: FSChunkType){
        switch (value){
            case FSChunkType.DeletedChunkIndex:
                this.deletedChunks.add(index);
            case FSChunkType.EmptyChunkIndex:
                this.availableChunks.push(index);
                this.occupiedChunks.delete(index);
                break;
            case FSChunkType.DataChunkIndex:
            case FSChunkType.NormalChunkIndex:
            case FSChunkType.SuperChunkIndex:
                //delete this.availableChunks[this.availableChunks.indexOf(index)];
                //不支持此操作
                
                this.occupiedChunks.add(index);
                break;
            default:
                throw new TypeError("数据 "+value+ " 不可用于区块状态");
        }
    }
    setRootDir(position: number){
        this.fsinfo.rootDirectoryChunkIndex = position;
    }
    constructor(chunk: Chunk){
        super(chunk);
        
        //读取文件系统信息。
        //NOTICE: 这里可能会TLE
        
        if (this.getDataStr(0) !== YmFSSuperChunk.ymfsHeadStr)
            throw new TypeError("not a valid super chunk");
        
        this.spblocks = this.getDataStr(1)
            .split("\u0000")
            .map(Number);
        
        this.fsinfo = new YmFS_FSInfo(this);

        this.chunkStatStorage = this.getDataStr(3)
            .split("")
            .map(Number);
        
        const availableChunks: number[] = [];
        
        this.chunkStatStorage.forEach((value, index, _array) => {
            switch (value){ //根据值，写入他们的状态到内存
                case FSChunkType.DeletedChunkIndex:
                    this.deletedChunks.add(index);
                case FSChunkType.EmptyChunkIndex:
                    availableChunks.push(index);
                    break;
                case FSChunkType.DataChunkIndex:
                case FSChunkType.NormalChunkIndex:
                case FSChunkType.SuperChunkIndex:
                    this.occupiedChunks.add(index);
                    break;
                default:
                    throw new Error("未知的数据 "+value+ " 位于 "+index);
            }
        });
        
        //反转可用块排列顺序，便于处理
        this.availableChunks = availableChunks.reverse();
    }
    flush(){
    }
    async flushAsync(){
    }
    checkDataValidity(){
    }
    occupiedChunks = new Set<number>();
    deletedChunks = new Set<number>();
    availableChunks: number[] = [];
    chunkStatStorage: FSChunkType[] = [];
}

