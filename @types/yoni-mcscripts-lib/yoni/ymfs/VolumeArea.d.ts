import { YoniDimension } from "../dimension.js";
import { Location } from "../Location.js";
export interface VolumeArea {
    dimension: YoniDimension;
    begin: Readonly<Location>;
    /** size */
    x: number;
    /** size */
    y: number;
    /** size */
    z: number;
}
