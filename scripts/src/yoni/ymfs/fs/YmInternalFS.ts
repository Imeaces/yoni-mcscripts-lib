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

function isVolumeHasInitializedYmFS(volume: Volume): boolean {
    return volume.getChunk(0).getDataStr(0) === "Yoni_YmFS\u00001";
}
function readVBlockStats(volume: Volume): number[] {
    return volume.getChunk(0).getDataStr(1).split("").map(Number);
}
let vblockStats: number[];
function find_1(stat, index){
    if (index < lastSelectedIndex){
        return false;
    }
    if (stat === 0){
        return true;
    }
    return false;
}
function allocateVBlocks(count: number){
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
    
    cleanVBlocks(vblocks);
    return vblocks;
}

function createDataBlocks(count: number){
}
function createNodeBlock(){
}

function createDir(){
}
function createFile(){
}

function readFile(){
}

function writeFile(){
}

function listDir(){
}
function deleteFile(){
}

function cleanVBlocks(volume: Volume, vblocks: number[]){
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
