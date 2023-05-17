import { Chunk } from "../disk/Chunk.js";
import { ChunkBlock } from "../disk/ChunkBlock.js";

export abstract class YmFS_FileNode {
    readonly fileSystem: any;
    readonly chunk: Chunk;
    readonly extDataBlocks: number[];
    readonly fileType: string;
    setExtDataBlocks(blocks: number[]){
        this.extDataBlocks.length = 0;
        this.extDataBlocks.push(...blocks);
        this.flushFileNodeInfo();
    }
    #fileSize: number;
    #linkCount: number;
    #createTime: number;
    #modifyTime: number;
    #accessTime: number;
    get fileSize(): number {
        return this.#fileSize;
    }
    get linkCount(): number {
        return this.#linkCount;
    }
    get createTime(): number {
        return this.#createTime;
    }
    get modifyTime(): number {
        return this.#modifyTime;
    }
    get accessTime(): number {
        return this.#accessTime;
    }
    set fileSize(v: number){
        this.#fileSize = v;
        this.flushFileNodeInfo();
    }
    set linkCount(v: number){
        this.#linkCount = v;
        this.flushFileNodeInfo();
    }
    set createTime(v: number){
        this.#createTime = v;
        this.flushFileNodeInfo();
    }
    set modifyTime(v: number){
        this.#modifyTime = v;
        this.flushFileNodeInfo();
    }
    set accessTime(v: number){
        this.#accessTime = v;
        this.flushFileNodeInfo();
    }
    flushFileNodeInfo(force: boolean = false){
        if (!force && this.fileSystem.asyncFileSystem)
            return;
        
        const { fileType, fileSize, linkCount, createTime, modifyTime, accessTime } = this;
        const curindex = this.chunk.index;
        YmFS_FileNode.writeStringArray(this.chunk.getBlock(0), [
            curindex,
            fileType,
            fileSize,
            linkCount,
            createTime,
            modifyTime,
            accessTime,
            ...this.extDataBlocks
        ]);
    }
    abstract delete(): boolean;
    abstract isDeleted(): boolean;
    constructor(fileSystem: any, chunk: Chunk){
        this.fileSystem = fileSystem;
        this.chunk = chunk;
        const data = YmFS_FileNode.readStringArray(chunk.getBlock(0));
        let [s_curindex,
            s_filetype,
            s_size,
            s_links,
            s_ctime,
            s_mtime,
            s_atime,
            ...s_extblocks
        ] = data;
        if (chunk.index !== Number(s_curindex))
            throw new Error();
        
        this.fileType = s_filetype;
        this.#fileSize = Number(s_size);
        this.#linkCount = Number(s_links);
        this.#createTime = Number(s_ctime);
        this.#modifyTime = Number(s_mtime);
        this.#accessTime = Number(s_atime);
        this.extDataBlocks = s_extblocks.map(Number);
    }
    static initializeFileNode(chunk: Chunk){
        let curindex = chunk.index;
        let filetype = "0";
        let size = 0;
        let links = 0;
        let ctime = Date.now();
        let mtime = ctime;
        let atime = ctime;
        
        YmFS_FileNode.writeStringArray(chunk.getBlock(0), [
            curindex,
            filetype,
            size,
            links,
            ctime,
            mtime,
            atime,
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
