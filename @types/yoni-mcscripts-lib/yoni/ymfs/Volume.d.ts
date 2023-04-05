import { Location, Vector3, DimensionLike } from "../Location.js";
import { VolumeArea } from "./VolumeArea.js";
import { Chunk } from "./Chunk.js";
export declare class Volume {
    get size(): number;
    volumeArea: VolumeArea;
    constructor(dimension: DimensionLike, beginPoint: Vector3, endPoint: Vector3);
    getChunk(position: number): Chunk;
    static position2Location(position: number, area: VolumeArea): Location;
}
