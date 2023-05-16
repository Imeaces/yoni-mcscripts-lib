import { Minecraft } from "../../basis.js";
import { YoniDimension, Dimension } from "../../dimension.js";
import { Location, Vector3, DimensionLikeValue } from "../../Location.js";
import { VolumeArea } from "./VolumeArea.js";
import { Chunk } from "./Chunk.js";

type VolumeCache = (undefined | string[])[];
interface VolumeOptions {
    asyncVolumeSystem?: boolean;
}
interface VolumeAreaOption {
    dimension: DimensionLikeValue;
    begin: Vector3;
    end: Vector3;
}

export class Volume {
    static position2Location(position: number, area: VolumeArea): Location {
        let { x, y, z } = area;
        let baseLocation = area.begin.clone();
        
        let nX = (position % x) >>> 0;
        let nY = (position / x % y) >>> 0;
        let nZ = (position / x / y % z) >>> 0;
        
        if (nZ > z){
            throw new RangeError("chunk position "+position+" out of volume size");
        }
        
        return baseLocation.add([nX, nY, nZ]);
    }
    readonly size: number;
    readonly asyncVolumeSystem: boolean;
    readonly volumeArea: VolumeArea;
    readonly cachedChunks: (undefined | Chunk)[]; 
    constructor(area: VolumeAreaOption, options?: VolumeOptions){
        let dimension = Dimension.dim(area.dimension);
        
        let bLoc = area.begin;
        let eLoc = area.end;
        
        let bX = Math.min(bLoc.x, eLoc.x);
        let bY = Math.min(bLoc.y, eLoc.y);
        let bZ = Math.min(bLoc.z, eLoc.z);
        
        let eX = Math.max(bLoc.x, eLoc.x);
        let eY = Math.max(bLoc.y, eLoc.y);
        let eZ = Math.max(bLoc.z, eLoc.z);
        
        let volumeArea = {
            dimension: dimension,
            begin: new Location(dimension, bX, bY, bZ),
            x: (eX - bX) + 1,
            y: (eY - bY) + 1,
            z: (eZ - bZ) + 1,
        };
        
        let size = volumeArea.x * volumeArea.y * volumeArea.z;
        
        this.volumeArea = volumeArea;
        this.size = size;
        this.cachedChunks = new Array(size);
        this.asyncVolumeSystem = options?.asyncVolumeSystem ?? false;
    }
    _addCache(position: number, chunk: Chunk){
        if (position in this.cachedChunks){
            if (this._getCache(position) !== chunk){
                throw new Error("position "+position+" already been cached");
            }
        } else {
            this.cachedChunks[position] = chunk;
        }
    }
    _getCache(position: number){
        if (!(position in this.cachedChunks)){
            return undefined;
        }
        return this.cachedChunks[position] as Chunk;
    }
    _removeCache(position: number, noSaveing: boolean = false){
        throw new Error("not implemented");
        
        delete this.cachedChunks[position];
    }
    isCachedChunk(position: number){
        return position in this.cachedChunks;
    }
    getChunk(position: number): Chunk {
        let cache = this._getCache(position);
        if (cache !== undefined){
            return cache;
        }
        
        let location = Volume.position2Location(position, this.volumeArea);
        
        let chunk = new Chunk(this, position, location);
        
        if (this.asyncVolumeSystem){
            this._addCache(position, chunk);
        }
        
        return chunk;
    }
    flushChunks(forceProcess: boolean = false): void {
        throw new TypeError("not implemented");
        
        if (this.cachedChunks.length === 0){
            return;
        }
    }
}

