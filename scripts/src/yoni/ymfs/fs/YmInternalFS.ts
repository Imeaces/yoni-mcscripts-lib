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

export function isVolumeHasInitializedYmFS(volume: Volume): boolean {
    return volume.getChunk(0).getDataStr(0) === "Yoni_YmFS\u00001";
}
export function readVBlockStats(volume: Volume): number[] {
    return volume.getChunk(0).getDataStr(1).split("").map(Number);
}
export function writeVBlockStats(volume: Volume, stats: number[]){
    volume.getChunk(0).setDataStr(1, stats.join(""));
}
let vblockStats: number[];
export function allocateVBlocks(volume: Volume, count: number){
    let vblocks: number[] = [];
    let lastSelectedIndex = -1;
    
    for (let _i = 0; _i < vblockStats.length; _i ++){
        if (vblockStats[_i] === VBlockTypes.Deleted
        || vblockStats[_i] === VBlockTypes.Empty){
            vblocks.push(_i);
        }
        if (count <= vblocks.length){
            break;
        }
    }
    if (count > vblocks.length){
        throw new Error();
    }
    
    cleanVBlocks(volume, vblocks);
    return vblocks;
}

export function createDataBlocks(volume: Volume, count: number){
    let vblocks = allocateVBlocks(volume, count);
    for (let idx of vblocks){
        vblockStats[idx] = VBlockTypes.Data;
    }
}
export function createNodeBlock(volume: Volume){
    let [vblock] = allocateVBlocks(volume, 1);
    vblockStats[vblock] = VBlockTypes.Normal;
    let time = Date.now();
    writeNodeInfo(volume, vblock, {
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
enum FileType {
    directory = "d",
    file = "f",
    symlink = "s",
    dummy = "0",
}
export function modFileType(volume: Volume, nodeBlock: number, type: FileType){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    let info = readNodeInfo(volume, nodeBlock);
    info.fileType = type;
    writeNodeInfo(volume, nodeBlock, info);
}
export function getFileSize(volume: Volume, nodeBlock: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    let info = readNodeInfo(volume, nodeBlock);
    return info.fileSize;
}
export function modFileSize(volume: Volume, nodeBlock: number, size: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    if (size < 0 || Math.floor(size) !== size || !isFinite(size)){
        throw new Error();
    }
    let info = readNodeInfo(volume, nodeBlock);
    info.fileSize = size;
    writeNodeInfo(volume, nodeBlock, info);
}
export function increaseLinkCount(volume: Volume, nodeBlock: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    let info = readNodeInfo(volume, nodeBlock);
    info.linkCount += 1;
    writeNodeInfo(volume, nodeBlock, info);
}
export function getVBlockStat(vblock: number): VBlockTypes {
    return vblockStats[vblock] as unknown as VBlockTypes;
}
export function atime(volume: Volume, nodeBlock: number, time: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    writeNodeInfo(volume, nodeBlock, Object.assign(readNodeInfo(volume, nodeBlock), { accessTime: time}));
}
export function ctime(volume: Volume, nodeBlock: number, time: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    writeNodeInfo(volume, nodeBlock, Object.assign(readNodeInfo(volume, nodeBlock), { createTime: time}));
}
export function mtime(volume: Volume, nodeBlock: number, time: number){
    if (getVBlockStat(nodeBlock) !== VBlockTypes.Normal){
        throw new Error();
    }
    writeNodeInfo(volume, nodeBlock, Object.assign(readNodeInfo(volume, nodeBlock), { modifyTime: time}));
}
function isValidFileType(v: any): v is FileType {
    return Object.values(FileType).some(t => t === v);
}
export function readNodeInfo(volume: Volume, nodeBlock: number): NodeVBlockInfo {
    let infoArr = volume.getChunk(nodeBlock).getStringArray(0);
    let [curindex, filetype, fileSize, linkCount, createTime, modifyTime, accessTime] = infoArr;
    let r_filetype: FileType;
    if (isValidFileType(filetype)){
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
interface NodeVBlockInfo {
    curIndex: number;
    fileType: FileType;
    fileSize: number;
    linkCount: number;
    createTime: number;
    modifyTime: number;
    accessTime: number;
}
export function writeNodeInfo(volume: Volume, nodeBlock: number, info: Partial<NodeVBlockInfo>){
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
export function createDir(volume: Volume, parent: number){
    let nodeBlock = createNodeBlock(volume);
    let vblock = volume.getChunk(nodeBlock);
    modFileType(volume, nodeBlock, FileType.directory);
}
export function createFile(volume: Volume){
    let nodeBlock = createNodeBlock(volume);
    let vblock = volume.getChunk(nodeBlock);
    modFileType(volume, nodeBlock, FileType.file);
}
enum ErrorCode {
}
//export function readDataBlock(volume: Volume, vblock: 
export function readFile(volume: Volume, fileNode: number, startIndex: number, length: number): ArrayBuffer | -1 {
    let dataBlocks = volume.getChunk(fileNode).getDataStr(1).split(".").map(Number);
    let maxSize = getFileSize(volume, fileNode);
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

export function writeFile(){
}

export function listDir(volume: Volume, block: number){
}
export function deleteFile(){
}

export function cleanVBlocks(volume: Volume, vblocks: number[]){
    for (let idx of vblocks){
        let chunk = volume.getChunk(idx);
        for (let b = 0; b < chunk.size; b++){
            chunk.setDataStr(b, "");
        }
    }
}

/** 区块状态枚举 */
export enum VBlockTypes {
    Empty = 0,
    Super = 1,
    Data = 2,
    Normal = 3,
    Deleted = 4,
}
