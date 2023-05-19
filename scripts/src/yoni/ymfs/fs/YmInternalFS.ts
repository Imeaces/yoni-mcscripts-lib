/*interface InternalFS {
    countAvailableVBlocks(): number;
    countTotalVBlocks(): number;
    countUsedVBlocks(): number;
    
    allocateVBlocks(count: number, options?: AllocationOptions): number[];
    reduceVBlocks(vblocks: number[]): void;
    
}
interface AllocationOptions {
    nearVBlock?: number;
}
class YmInternalFS {
    vblockStats: number[] = [];
    constructor(volume: Volume){
        volume.getChunk(0).
    }
    static readVolumeInfo(volume: Volume){
        let b_0 = volume.getChunk(0).getDataStr();
        if (b_0 !== "YmFS\u00001")
            throw new Error();
        
        let b_1 = volume.getChunk(1).getDataStr();
        
        let storage_vblock_stats = b_1.split(/.|,/);
        if (vblockstatseq.length % 2 !== 0){
            throw new Error();
        }
        storage_vblock_stats.reduce((acc, cur, idx, arr) => {
            if (idx % 2 === 0){
                acc.push([]);
            }
            acc[acc.length-1].push(arr);
            return acc;
        }, [])
        .forEach(
    }
}

class VolumeUtils {
    static readFromRange(ranges: number[][]){
    }
}


*/
import { Volume } from "../disk/Volume.js";

/** 区块状态枚举 */
export enum VBlockTypes {
    Empty = 0,
    Super = 1,
    Data = 2,
    Normal = 3,
    Deleted = 4,
}

export type DataBlockInfo = any;
export type VBlockStats = VBlockTypes[];
export type VBlockIndex = number;
export interface NodeVBlockInfo {
    curIndex: number;
    fileType: FileType;
    fileSize: number;
    linkCount: number;
    createTime: number;
    modifyTime: number;
    accessTime: number;
}

export enum FileType {
    directory = "d",
    file = "f",
    symlink = "s",
    dummy = "0",
}

export class InternalVolumeFileSystem {
    static isVolumeHasInitializedYmFS(volume: Volume): boolean {
        return volume.getChunk(0)
            .getDataStr(0) === "Yoni_YmFS\u00001";
    }
    vBlockStats: VBlockStats;
    static readVBlockStats(volume: Volume): VBlockStats {
        const stats = volume.getChunk(0)
            .getDataStr(1)
            .split("")
            .map(Number);
        if (!InternalVolumeFileSystem.#checkVBlockStats(stats)){
            throw new Error();
        }
        return stats;
    }
    static #checkVBlockStats(unknownStats: number[]): unknownStats is VBlockStats {
        const values = Object.values(VBlockTypes);
        for (const ustastval of unknownStats){
            if (!values.includes(ustastval)){
                return false;
            }
        }
        return true;
    }
    static writeVBlockStats(volume: Volume, stats: VBlockStats){
        volume.getChunk(0).setDataStr(1, stats.join(""));
    }
    getVBlockStat(vblock: number): VBlockTypes {
        const stat = this.vBlockStats[vblock];
        if (stat == null){
            throw new Error();
        }
        return stat;
    }
    volume: Volume;
    allocateVBlocks(count: number): VBlockIndex[] {
        let vblocks: VBlockIndex[] = [];
        
        for (let _i = 0; _i < this.vBlockStats.length; _i ++){
            if (this.vBlockStats[_i] === VBlockTypes.Deleted
            || this.vBlockStats[_i] === VBlockTypes.Empty){
                vblocks.push(_i);
            }
            if (count <= vblocks.length){
                break;
            }
        }
        if (count > vblocks.length){
            throw new Error();
        }
        
        this.cleanVBlocks(vblocks);
        return vblocks;
    }
    cleanVBlocks(vblocks: number[]){
        for (let idx of vblocks){
            let chunk = this.volume.getChunk(idx);
            for (let b = 0; b < chunk.size; b++){
                chunk.setDataStr(b, "");
            }
        }
    }
    createDataBlocks(count: number){
        let vblocks = this.allocateVBlocks(count);
        for (let idx of vblocks){
            this.vBlockStats[idx] = VBlockTypes.Data;
        }
    }
    dataBlockStat(dbblock: number): DataBlockInfo {
    }
    readDataBlock(dbblock: number, start: number, length: number): ArrayBuffer {
    }
    
    createNodeBlock(){
        let [vblock] = this.allocateVBlocks(1);
        this.vBlockStats[vblock] = VBlockTypes.Normal;
        let time = Date.now();
        InternalVolumeFileSystem.writeNodeInfo(this.volume, vblock, {
            curIndex: vblock,
            fileType: FileType.dummy,
            fileSize: 0,
            linkCount: 0,
            createTime: time,
            modifyTime: time,
            accessTime: time,
        });
        return vblock;
    }
    
    static readNodeInfo(volume: Volume, nodeBlock: number): NodeVBlockInfo {
        let infoArr = volume.getChunk(nodeBlock).getStringArray(0);
        let [curindex, filetype, fileSize, linkCount, createTime, modifyTime, accessTime] = infoArr;
        let r_filetype: FileType;
        if (InternalVolumeFileSystem.isValidFileType(filetype)){
            r_filetype = filetype;
        } else {
            throw new Error();
        }
        return {
            curIndex: Number(curindex),
            fileType: r_filetype,
            fileSize: Number(fileSize),
            linkCount: Number(linkCount),
            createTime: Number(createTime),
            modifyTime: Number(modifyTime),
            accessTime: Number(accessTime),
        };
    }
    static writeNodeInfo(volume: Volume, nodeBlock: number, info: Partial<NodeVBlockInfo>){
        let infoArr = volume.getChunk(nodeBlock).getStringArray(0);
        let [curindex_old, filetype_old, fileSize_old, linkCount_old, createTime_old, modifyTime_old, accessTime_old] = infoArr;
        let info2 = Object.assign({
            curIndex: Number(curindex_old),
            fileType: filetype_old,
            fileSize: Number(fileSize_old),
            likeCount: Number(linkCount_old),
            createTime: Number(createTime_old),
            modifyTime: Number(modifyTime_old),
            accessTime: Number(accessTime_old),
        }, info);
        let { curIndex, fileType, fileSize, likeCount, createTime, modifyTime, accessTime } = info2;
        
        let info2Arr = [curIndex, fileType, fileSize, likeCount, createTime, modifyTime, accessTime];
        volume.getChunk(nodeBlock).setStringArray(0, info2Arr.map(String));
    }
    
    static #validFileTypes = Object.freeze(Object.values(FileType));
    static isValidFileType(v: any): v is FileType {
        return InternalVolumeFileSystem.#validFileTypes.some(t => t === v);
    }
    
    getFileType(nodeBlock: number): FileType {
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        let { fileType } = info;
        if (InternalVolumeFileSystem.isValidFileType(info.fileType)){
            return fileType;
        } else {
            throw new Error();
        }
    }
    modFileType(nodeBlock: number, type: FileType){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        info.fileType = type;
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, info);
    }
    
    getFileSize(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        return info.fileSize;
    }
    modFileSize(nodeBlock: number, size: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        if (size < 0 || Math.floor(size) !== size || !isFinite(size)){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        info.fileSize = size;
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, info);
    }
    
    getLinkCount(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        return info.linkCount;
    }
    increaseLinkCount(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        info.linkCount += 1;
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, info);
    }
    decreaseLinkCount(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        let info = InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock);
        info.linkCount -= 1;
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, info);
    }
    
    getatime(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        return InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock).accessTime;
    }
    atime(nodeBlock: number, time: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, Object.assign(InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock), { accessTime: time}));
    }
    
    getctime(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        return InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock).createTime;
    }
    ctime(nodeBlock: number, time: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, Object.assign(InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock), { createTime: time}));
    }
    
    getmtime(nodeBlock: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        return InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock).modifyTime;
    }
    mtime(nodeBlock: number, time: number){
        if (this.getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
            throw new Error();
        }
        InternalVolumeFileSystem.writeNodeInfo(this.volume, nodeBlock, Object.assign(InternalVolumeFileSystem.readNodeInfo(this.volume, nodeBlock), { modifyTime: time}));
    }
    
    createDir(parent: number){
        let nodeBlock = this.createNodeBlock();
        let vblock = this.volume.getChunk(nodeBlock);
        this.modFileType(nodeBlock, FileType.directory);
    }
    createFile(volume: Volume){
        let nodeBlock = this.createNodeBlock();
        let vblock = volume.getChunk(nodeBlock);
        this.modFileType(nodeBlock, FileType.file);
    }

    readFile(fileNode: number, startIndex: number, length: number): ArrayBuffer | -1 {
        let dataBlocks = this.volume.getChunk(fileNode).getDataStr(1).split(".").map(Number);
        let maxSize = this.getFileSize(fileNode);
        if (maxSize < startIndex + length || length < 0){
            return -1;
        }
        let buffer = new ArrayBuffer(length);
        let startDataBlock = Math.floor(startIndex / 512);
        let dataStartIndex = startIndex % 512;
        for (let i = startDataBlock; i < dataBlocks.length; i++){
            
        }
        return buffer;
    }
    
    writeFile(){
    }
    
    listDir(volume: Volume, block: number){
    }
    deleteFile(){
    }
}
