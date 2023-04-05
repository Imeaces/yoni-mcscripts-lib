import { Command } from "../command.js";
import { Volume } from "./Volume.js";
import { Chunk } from "./Chunk.js";
import { ChunkBlock } from "./ChunkBlock.js";
import { VolumeArea } from "./VolumeArea.js";
import { World } from "../world.js";
import { Location } from "../Location.js";
import { divideCube } from "./divideCube.js";
import { Minecraft } from "../basis.js";

class YmFS {
    /**
     * 指定是否使用异步写入。
     */
    static asyncFileSystem: boolean = true;
    static volumeRealArea = Object.freeze({
        dimension: World.getDimension("overworld"),
        begin: new Location("overworld", {
            x: 1048576, y: -64, z: 1048576
        }), x: 16, y: 384, z: 16
    });
    //static name = "YmFS"; //可能不需要自己定义
    static #initialized = false;
    static #volume: Volume; 
    static async init(){
        if (YmFS.#initialized)
            return;
        
        await YmFS.#init();
    }
    static async #init(){
        YmFS.#volume = new Volume(
            YmFS.volumeRealArea.dimension,
            YmFS.volumeRealArea.begin,
            new Location(YmFS.volumeRealArea.begin)
                .add(YmFS.volumeRealArea)
                .subtract([1, 1, 1])
        );
        let _bool: boolean;
        let processor = new YmFSInitialProcessor(YmFS.#volume, YmFS.name);
        
        _bool = true;
        _bool = await processor.addTickingArea();
        if (_bool)
            await processor.formatFsArea();
        
    }
}

class YmFSInitialProcessor {
    area: VolumeArea;
    name: string = "untitled";
    volume: Volume;
    constructor(volume: Volume, name?: string){
        this.volume = volume;
        this.area = volume.volumeArea;
        if (name)
            this.name = name;
        if (this.volume.size < 2)
            throw new Error("Volume too small");
    }
    async formatFsArea(){
        await this.fillArea();
    }
    async fillArea(){
        let cubes = divideCube(this.area, 8192);
        let block = Minecraft.MinecraftBlockTypes.chest;
        for (let cube of cubes){
            this.area.dimension.fillBlocks(
                cube.begin,
                
                new Location(cube.begin)
                    .add(cube)
                    .subtract([1, 1, 1]),
                    
                block
            );
            await 1; //pause
        }
    }
    async addTickingArea(): Promise<boolean> {
        let { x: x0, y: y0, z: z0 } = this.area.begin;
        let { x, y, z } = this.area;
        return Command.addExecute(Command.PRIORITY_HIGHEST, this.area.dimension, Command.getCommand("tickingarea add",
            x0, y0, z0,
            "~"+String(x-1), "~"+String(y-1), "~"+String(z-1),
            this.name)
        )
        .then(result => {
            if (result.statusCode === 0)
                return true;
            else
                return false;
        });
    }
}
class YmFSChunk {
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

/** 区块索引类型 */
type YmFS_ChunkIndex = number;

/** 区块状态枚举 */
enum YmFSSuperChunkData_ChunkType {
    EmptyChunkIndex = 0,
    SuperChunkIndex = 1,
    DataChunkIndex = 2,
    NormalChunkIndex = 3,
    DeletedChunkIndex = 4,
}

class YmFS_FSInfo {
    #chunk: YmFSSuperChunk;
    #totalChunkCount: number;
    #rootDirectoryChunkIndex: number;
    get totalChunkCount(): number {
        return this.#totalChunkCount;
    }
    get rootDirectoryChunkIndex(): number {
        return this.#rootDirectoryChunkIndex;
    }
    set rootDirectoryChunkIndex(index) {
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
class YmFSSuperChunk extends YmFSChunk {

    fsinfo: YmFS_FSInfo;
    spblocks: YmFS_ChunkIndex[];
    static initialInfoOfVolume(chunk: Chunk, volume: Volume){
        
        //步骤1，将所有区块的状态设置为空
        let chunkStatStorage: YmFSSuperChunkData_ChunkType[] = [];
        
        for (let index = 0; index < volume.size; index++){
            chunkStatStorage.push(YmFSSuperChunkData_ChunkType.EmptyChunkIndex);
        }
        
        if (chunkStatStorage.length < 2)
            throw new Error("Volume space too small");
        
        //将0块状态设置为超级块
        chunkStatStorage[chunk.index] = YmFSSuperChunkData_ChunkType.SuperChunkIndex;
        
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
        
        return new YmFSSuperChunk(chunk);
    }
    static ymfsHeadStr = "Yoni_YmFS\u00001";
    /**
     * 为指定块设置状态，并更新记录。
     *
     * 将状态设置为被占用类型时，不会从可用块记录移除特定块。
     */
    setStat(index: number, value: YmFSSuperChunkData_ChunkType){
        switch (value){
            case YmFSSuperChunkData_ChunkType.DeletedChunkIndex:
                this.deletedChunks.add(index);
            case YmFSSuperChunkData_ChunkType.EmptyChunkIndex:
                this.availableChunks.push(index);
                this.occupiedChunks.delete(index);
                break;
            case YmFSSuperChunkData_ChunkType.DataChunkIndex:
            case YmFSSuperChunkData_ChunkType.NormalChunkIndex:
            case YmFSSuperChunkData_ChunkType.SuperChunkIndex:
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
                case YmFSSuperChunkData_ChunkType.DeletedChunkIndex:
                    this.deletedChunks.add(index);
                case YmFSSuperChunkData_ChunkType.EmptyChunkIndex:
                    availableChunks.push(index);
                    break;
                case YmFSSuperChunkData_ChunkType.DataChunkIndex:
                case YmFSSuperChunkData_ChunkType.NormalChunkIndex:
                case YmFSSuperChunkData_ChunkType.SuperChunkIndex:
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
    chunkStatStorage: YmFSSuperChunkData_ChunkType[] = [];
}

/*
function formatYmFS(volume: Volume){
    
    let chunkStatStorage: YmFSSuperChunkData_ChunkType[] = [];
    let emptyChunks: number[] = [];
    
    for (let index = 0; index < volume.size; index++){
        chunkStatStorage.push(YmFSSuperChunkData_ChunkType.EmptyChunkIndex);
        emptyChunks.push(index);
    }
    emptyChunks = emptyChunks.reverse();
    
    if (chunkStatStorage.length < 2)
        throw new Error("Volume space too small");
        
    //super block
    let spblocks: number[] = [emptyChunks.pop()];
    let spblock0 = spblocks[0];
    
    let rootdirblock = emptyChunks.shift();
    
    YmFS_FileNode_Directory.initialFileNode(rootdirblock, rootdirblock);

}
*/

/*
function _a(chunk: Chunk){
    let block1 = chunk.getBlock(0);
    let block2 = chunk.getBlock(1);
    let block3 = chunk.getBlock(2);
    
    // prepare data
    
    
    let chunkStats = new Map<number, YmFSSuperChunkData_ChunkType>();
    
    for (let index = 0; index < chunk.volume.size; index++){
        chunkStats.set(index, YmFSSuperChunkData_ChunkType.EmptyChunkIndex);
    }
    
    chunkStats.set(chunk.index, YmFSSuperChunkData_ChunkType.SuperChunkIndex);
    
    let dataStr = "";
    let datas: string[] = [];
    for (let entry of chunkStats.entries()){
        let nextItem = String(entry[1])+String(entry[0]);
        if (dataStr.length + nextItem.length > 512){
            datas.push(dataStr);
            dataStr = "";
        }
        dataStr += nextItem;
    }
    
    let totalChunkCount = chunkStats.size;
    
    let rootDirIndex = 0;
    
    let str3 = `${totalChunkCount}\u0000${rootDirIndex}`;
    
    let extDataChunk: Chunk[] = [];
    
    let str2 = "";
    // write data

    block1.setDataStr(str1);
    block3.setDataStr(str3);
    
    let dataChunk = chunk;
    let dataIndex = 3;
    while (datas.length > 0){
        let dataStr = datas[0];
        
        let block;
        try {
            block = chunk.getBlock(dataIndex++);
        } catch {
            
            continue;
        }
        
        block.setDataStr(dataStr);
        datas.shift();
    }
}
*/


/**
 * #CurrentBlock#\u0000#FileType#\u0000#FileSize#\u0000#CreateTime#\u0000#ModifyTime#\u0000#AccessTime#\u0000
 * 
 * FileType: Directory
 * 目录文件
 * \u0001
 * FileSize: 目录下含有的子文件数量
 * CreateTime: 目录的创建时间戳，精确到毫秒
 * ModifyTime: 目录下子文件列表被更新的时间戳，精确到毫秒
 * AccessTime: 目录最后一次被访问（读取与该文件有关的任何块）的时间戳，毫秒）
 * CurrentBlock: 此filenode所在的块
 * ParentDirectory: 父级目录所在filenode
 */
class YmFS_FileNode_Directory {
    static initialFileNode(chunk: Chunk, parent: Chunk){
        let curBlock = chunk.index;
        let fileType = "d";
        let fileSize = 0;
        let createTime = Date.now();
        let modifyTime = createTime;
        let accessTime = 0;
        let parentNode = parent.index;
        
        YmFS_FileNode.writeStringArray(chunk.getBlock(0), [
            curBlock,
            fileType,
            fileSize,
            createTime,
            modifyTime,
            accessTime,
            parentNode
        ]);
    }
}

class YmFS_FileNode {
    static initialFileNode(chunk: Chunk){
        //#CurrentBlock#\u0000#FileType#\u0000#FileSize#\u0000#CreateTime#\u0000#ModifyTime#\u0000#AccessTime#\u0000
        throw new TypeError("example code, doesn't propose for execute");
        
        let curBlock = chunk.index;
        let fileType = "0";
        let fileSize = 0;
        let createTime = Date.now();
        let modifyTime = createTime;
        let accessTime = 0;
        
        YmFS_FileNode.writeStringArray(chunk.getBlock(0), [
            curBlock,
            fileType,
            fileSize,
            createTime,
            modifyTime,
            accessTime,
        ]);
    }
    static readStringArray(block: ChunkBlock): string[] {
        let str = block.getDataStr();
        return str.split("\u0000");
    }
    static writeStringArray(block: ChunkBlock, arr: any[]){
        let strarr = arr.map(v => {
            let str = String(v);
            if (str.indexOf("\u0000") !== -1){
                throw new RangeError("\\u0000 not allowed");
            }
            return str;
        });
        block.setDataStr(strarr.join("\u0000"));
    }
}


class YmFSNormalChunk {
}

class YmFSDeletedChunk {
}

class YmFSDataChunk {
}
