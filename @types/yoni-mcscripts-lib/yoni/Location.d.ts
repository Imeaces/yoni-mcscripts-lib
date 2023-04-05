import { Minecraft } from "./basis.js";
import { YoniDimension } from "./dimension.js";
import { YoniBlock } from "./block.js";
/**
 * 代表Minecraft中的特定位置，包含维度，坐标，旋转角。
 */
declare class Location implements ILocation {
    #private;
    /**
     * 处于零点的Location对象。
     */
    static get zero(): Location;
    /**
     * @param {number} num
     * @returns {number}
     */
    static normalizePitch(num: number): number;
    /**
     * @param {number} num
     * @returns {number}
     */
    static normalizeYaw(num: number): number;
    /**
     * @type {number}
     */
    get x(): number;
    set x(x: number);
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} x
     */
    setX(x: any): this;
    /**
     * @type {number}
     */
    get y(): number;
    set y(y: number);
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} y
     */
    setY(y: any): this;
    /**
     * @type {number}
     */
    get z(): number;
    set z(z: number);
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} z
     */
    setZ(z: any): this;
    /**
     * 设置此位置对应的坐标。
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x: number, y: number, z: number): this;
    /**
     * @type {number}
     */
    get rx(): number;
    set rx(rx: number);
    /**
     * 设置此位置对应的 pitch 角。
     * @param {number} v
     */
    setRx(rx: any): this;
    /**
     * 此位置对应的 yaw 角。
     * @type {number}
     */
    get ry(): number;
    set ry(ry: number);
    /**
     * 设置此位置对应的 yaw 角。
     * @param {number} v
     */
    setRy(ry: any): this;
    /**
     * 此位置所在的维度。
     * @type {YoniDimension}
     */
    get dimension(): YoniDimension;
    set dimension(dim: YoniDimension);
    /**
     * 设置此位置所在的维度
     * @param {DimensionLikeValue} dim
     */
    setDimension(dim: DimensionLikeValue): this;
    /**
     * 创建一个代表MC中特定位置的对象。其中包括维度，坐标，旋转角。
     
     * 可以以多种形式传递参数来构造一个Location。
     * 例如，大部分原版中需要一个位置的值。（Block, Entity）
     * 符合${link Vector3}的对象也可以传入。
     *
     * 参数传递顺序一般遵循以下规则。
     *
     * 先维度，后坐标，最后旋转角。
     *
     * 坐标先x，之后是y，最后是z
     *
     * 旋转角先是rx，后是ry
     *
     * 如果传入的参数中并不能读取到特定的值，则使用默认值补充。
     *
     * 注意，现在允许的参数类型中，包含尚未支持的类型 {@link Rotation}，这是因为我想支持这种，但是还没支持，先写了上去。
     */
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number, rx: number, ry: number);
    constructor(x: number, y: number, z: number, rx: number, ry: number);
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number);
    constructor(x: number, y: number, z: number);
    constructor(dimension: DimensionLikeValue, coords: Coords | CoordsArray, rotation: LocationRotation | Rotation | RotationArray);
    constructor(info1: CoordsDimensionInfo | DimensionCoordsArray | LocationCoords | CoordsArray, info2: LocationRotation | RotationArray);
    constructor(dimension: DimensionLikeValue, locationInfo: LocationCoords | CoordsRotationInfo | CoordsArray | CoordsRotationArray);
    constructor(locationInfo: LocationInfoObject | LocationInfo | LocationArray | DimensionCoordsArray | CoordsRotationArray | CoordsArray);
    /**
     * @param {Location1Arg} value
     */
    add(value: Location1Arg): Location;
    /**
     * @param {Location1Arg} value
     */
    subtract(value: Location1Arg): Location;
    /**
     * @param {Location1Arg} value
     */
    multiply(value: Location1Arg): Location;
    /**
     * 复制一个Location对象，然后将坐标设置为原点。
     */
    zero(): Location;
    /**
     * 计算此坐标与指定位置的距离。
     * @param {Location1Arg} loc
     */
    distance(loc: Location1Arg): number;
    /**
     * @param {Location1Arg} loc
     */
    distanceSquared(loc: Location1Arg): number;
    getLength(): number;
    getLengthSquared(): number;
    /**
     * @param {number} v
     */
    toFixed(v: number): Location;
    toVector(): Minecraft.Vector;
    getDirection(): void;
    setDirection(): void;
    /**
     * @returns {YoniBlock} 此位置上的方块。
     */
    getBlock(): YoniBlock;
    getBlockX(): number;
    getBlockY(): number;
    getBlockZ(): number;
    /**
     * 返回一个取整后的坐标，且旋转角为0
     */
    toBlockLocation(): Location;
    /**
     * 返回一个在此坐标上偏移指定坐标的Location
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    offset(x: number, y: number, z: number): Location;
    /**
     * @returns {Minecraft.BlockLocation} 根据此位置创建一个原版的Minecraft.BlockLocation
     */
    getVanillaBlockLocation(): {
        x: number;
        y: number;
        z: number;
    };
    /**
     * @returns {Minecraft.Location} 根据此位置创建一个原版的Minecraft.Location
     */
    getVanillaLocation(): {
        x: number;
        y: number;
        z: number;
    };
    getVanillaVector(): Minecraft.Vector;
    isLoaded(): boolean;
    getChunk(): void;
    checkFinite(): void;
    /**
     * 判断传入的位置是否与此位置对象代表的位置相同。
     * @param {Location1Arg} loc
     */
    equals(loc: Location1Arg): boolean;
    /**
     * 判断传入的位置的坐标是否与此位置对象代表的坐标相同。
     * @param {Location1Arg} loc
     */
    equalsPosition(loc: Location1Arg): boolean;
    clone(): Location;
    toString(): string;
    toJSON(): {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        dimension: string;
    };
    /**
     * 将一个Location对象转换为一段字符串
     * @param {Location} v
     * @returns {string}
     */
    static serialize(v: Location): string;
    /**
     * 将一段由Location对象转换后的字符串转换为Location对象
     * @param {string} v
     * @returns {Location}
     */
    static deserialize(v: string): Location;
    /**
     * 创建一个只读的Location对象。
     * @returns {Readonly<Location>}
     */
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number, rx: number, ry: number): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number, rx: number, ry: number): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: Coords | CoordsArray, rotation: LocationRotation | Rotation | RotationArray): Readonly<Location>;
    static createReadonly(info1: CoordsDimensionInfo | DimensionCoordsArray | LocationCoords | CoordsArray, info2: LocationRotation | RotationArray): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, locationInfo: LocationCoords | CoordsRotationInfo | CoordsArray | CoordsRotationArray): Readonly<Location>;
    static createReadonly(locationInfo: LocationInfoObject | LocationInfo | LocationArray | DimensionCoordsArray | CoordsRotationArray | CoordsArray): Readonly<Location>;
    /**
     * 使用Location创建创建一个只读的Location对象。
     * @param {Location} location
     * @returns {Readonly<Location>}
     */
    static makeReadonly(location: Location): Readonly<Location>;
    /**
     * @param {Location1Arg} start
     * @param {Location1Arg} end
     * @returns {Location[]}
     */
    static blocksBetween(start: Location1Arg, end: Location1Arg): Location[];
}
export default Location;
export { Location };
export declare type NetherDimensionLikeValue = -1 | 'minecraft:nether' | 'nether';
export declare type OverworldDimensionLikeValue = 0 | 'minecraft:overworld' | 'overworld';
export declare type TheEndDimensionLikeValue = 1 | 'minecraft:the_end' | 'the_end' | 'theEnd' | 'the end';
export declare type DimensionLikeValue = NetherDimensionLikeValue | OverworldDimensionLikeValue | TheEndDimensionLikeValue | Minecraft.Dimension | YoniDimension;
export interface ILocation extends LocationCoords, LocationRotation {
    dimension: YoniDimension;
}
export interface LocationCoords {
    x: number;
    y: number;
    z: number;
}
export interface LocationRotation {
    rx: number;
    ry: number;
}
export interface Coords {
    x: number;
    y: number;
    z: number;
}
export interface Rotation {
    x: number;
    y: number;
}
export declare type CoordsGetter = {
    getLocation(): Coords;
};
export declare type RotationGetter = {
    getRotation(): Rotation;
};
export declare type DimensionGetter = {
    getDimension(): DimensionLikeValue;
};
export declare type CoordsAccessor = {
    location: Coords;
};
export declare type RotationAccessor = {
    rotation: Rotation;
};
export declare type DimensionAccessor = {
    dimension: DimensionLikeValue;
};
export declare type LocationCoordsAccessor = {
    location: LocationCoords;
};
export declare type LocationRotationAccessor = {
    rotation: LocationRotation;
};
export declare type LocationDimensionAccessor = {
    dimension: DimensionLikeValue;
};
export declare type LocationInfoObject = (CoordsAccessor & DimensionAccessor & RotationAccessor) | (CoordsAccessor & DimensionAccessor) | (CoordsAccessor & RotationAccessor) | CoordsAccessor;
export declare type CoordsRotationInfo = LocationCoordsAccessor & LocationRotationAccessor;
export declare type CoordsDimensionInfo = LocationCoordsAccessor & LocationDimensionAccessor;
export declare type CoordsArray = [number, number, number];
export declare type RotationArray = [number, number];
export declare type DimensionCoordsArray = [DimensionLikeValue, number, number, number];
export declare type CoordsRotationArray = [number, number, number, number, number];
export declare type LocationArray = [DimensionLikeValue, number, number, number, number, number];
export declare type LocationInfo = {
    x: number;
    y: number;
    z: number;
    dimension?: DimensionLikeValue;
    rx?: number;
    ry?: number;
};
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export declare type Location1Arg = LocationInfoObject | LocationInfo | LocationArray | DimensionCoordsArray | CoordsRotationArray | CoordsArray;
export declare type LocationArgs1Params = [Location1Arg];
export declare type LocationArgs2Params = [
    CoordsDimensionInfo | DimensionCoordsArray | LocationCoords | CoordsArray,
    LocationRotation | RotationArray
] | [
    DimensionLikeValue,
    LocationCoords | CoordsRotationInfo | CoordsArray | CoordsRotationArray
];
export declare type LocationArgs3Params = [DimensionLikeValue, LocationCoords | CoordsArray, LocationRotation | Rotation | RotationArray] | CoordsArray;
export declare type LocationArgsMoreParams = LocationArray | CoordsRotationArray | DimensionCoordsArray;
export declare type LocationParams = LocationArgs1Params | LocationArgs2Params | LocationArgs3Params | LocationArgsMoreParams;
export { DimensionLikeValue as DimensionLike };
