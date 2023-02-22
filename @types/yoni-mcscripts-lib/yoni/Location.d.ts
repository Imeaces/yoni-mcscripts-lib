export default Location;
export type Vector3 = ILocationCoords;
export type NetherDimensionLike = -1 | 'minecraft:nether' | 'nether';
export type OverworldDimensionLike = 0 | 'minecraft:overworld' | 'overworld';
export type TheEndDimensionLike = 1 | 'minecraft:the_end' | 'the_end' | 'theEnd' | 'the end';
export type DimensionLike = NetherDimensionLike | OverworldDimensionLike | TheEndDimensionLike | Minecraft.Dimension | YoniDimension | Dimension;
export type ILocation = {
    x: number;
    y: number;
    z: number;
    rx?: number;
    ry?: number;
    dimension?: DimensionLike;
};
export type ILocationArray = [number, number, number] | [number, number, number, number, number] | [DimensionLike, number, number, number] | [DimensionLike, number, number, number, number, number];
export type ILocationCoords = {
    x: number;
    y: number;
    z: number;
};
export type ILocationCoordsWithDimension = {
    x: number;
    y: number;
    z: number;
    dimension: DimensionLike;
};
export type ILocationCoordsWithRotation = {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
};
export type ILocationCoordsArray = [number, number, number];
export type ILocationCoordsArrayWithDimension = [DimensionLike, number, number, number];
export type ILocationCoordsArrayWithRotation = [number, number, number, number, number];
export type ILocationRotation = {
    rx: number;
    ry: number;
};
export type ILocationRotationValue = {
    x: number;
    y: number;
};
export type ILocationRotationArray = [number, number];
export type ILocationOfObject = {
    location: ILocationCoords;
    rotation?: ILocationRotationValue;
    dimension?: DimensionLike;
};
export type Location1Arg = ILocationOfObject | ILocation | ILocationArray;
export type LocationArgs1Params = [Location1Arg];
export type LocationArgs2Params = [DimensionLike, ILocationCoords | ILocationCoordsWithRotation | [number, number, number] | [number, number, number, number, number]] | [ILocationCoords | [number, number, number] | ILocationCoordsWithDimension | [DimensionLike, number, number, number], ILocationRotation | [number, number]];
export type LocationArgs3Params = [DimensionLike, ILocationCoords | [number, number, number], ILocationRotation | [number, number]] | ILocationCoords;
export type LocationArgsMoreParams = ILocationArray;
export type LocationParams = [Location1Arg] | LocationArgs2Params | LocationArgs3Params | LocationArgsMoreParams;
/**
 * 代表Minecraft中的特定位置，包含维度，坐标，旋转角。
 */
export class Location {
    static "__#2@#checkReadOnly"(v: any): void;
    /**
     * @param {number} v
     * @returns {number}
     */
    static normalizePitch(v: number): number;
    /**
     * @param {number} v
     * @returns {number}
     */
    static normalizeYaw(v: number): number;
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
     * @param {LocationParams} values
     * @returns {Readonly<Location>}
     */
    static createReadonly(...values: LocationParams): Readonly<Location>;
    /**
     * @param {Location}
     * @returns {Readonly<Location>}
     */
    static makeReadonly(v: any): Readonly<Location>;
    /**
     * @desc 代表一个MC中的位置，其中包括维度，坐标，旋转角
     * @desc 您可以以多种形式传递参数来构造一个Location
     * @desc 比如，你可以将大部分原版中表示一个位置的变量作为参数传入
     * @desc 其中包括Block, Entity, 原版中符合Vector3接口的其他类型
     * @desc 同时额外支持更多形式的参数
     * @desc 参数顺序一般遵循以下规则
     * @desc 先维度，后坐标，最后旋转角
     * @desc 坐标先x，之后是y，最后是z
     * @desc 旋转角先是rx，后是ry
     * @desc 以下列出了所有的可能的参数形式，参数中不存在的内容将会以默认值补全
     * @desc dimension, x, y, z, rx, ry
     * @desc x, y, z, rx, ry
     * @desc dimension, x, y, z
     * @desc x, y, z
     * @desc dimension, {x, y, z}, {rx, ry}
     * @desc dimension, [x, y, z], {rx, ry}
     * @desc dimension, {x, y, z}, [rx, ry]
     * @desc dimension, [x, y, z], [rx, ry]
     * @desc {dimension, x, y, z}, {rx, ry}
     * @desc [dimension, x, y, z], {rx, ry}
     * @desc {dimension, x, y, z}, [rx, ry]
     * @desc [dimension, x, y, z], [rx, ry]
     * @desc {x, y, z}, {rx, ry}
     * @desc [x, y, z], {rx, ry}
     * @desc {x, y, z}, [rx, ry]
     * @desc [x, y, z], [rx, ry]
     * @desc dimension, {x, y, z, rx, ry}
     * @desc dimension, {x, y, z}
     * @desc dimension, [x, y, z, rx, ry]
     * @desc dimension, [x, y, z]
     * @desc {location: {x, y, z}, dimension, rotation: {x, y}}
     * @desc {location: {x, y, z}, dimension}
     * @desc {location: {x, y, z}, rotation: {x, y}}
     * @desc {location: {x, y, z}}
     * @desc {x, y, z, rx, ry, dimension}
     * @desc {x, y, z, rx, ry}
     * @desc {x, y, z, dimension}
     * @desc {x, y, z}
     * @desc [dimension, x, y, z, rx, ry]
     * @desc [x, y, z, rx, ry]
     * @desc [dimension, x, y, z]
     * @desc [x, y, z]
     * @param {LocationParams} values
     */
    constructor(...values: LocationParams);
    set x(arg: number);
    /**
     * @type {number}
     */
    get x(): number;
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} v
     */
    setX(v: number): void;
    set y(arg: number);
    /**
     * @type {number}
     */
    get y(): number;
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} v
     */
    setY(v: number): void;
    set z(arg: number);
    /**
     * @type {number}
     */
    get z(): number;
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param {number} v
     */
    setZ(v: number): void;
    /**
     * 设置此位置对应的坐标。
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x: number, y: number, z: number): Location;
    set rx(arg: number);
    /**
     * @type {number}
     */
    get rx(): number;
    /**
     * 设置此位置对应的 pitch 角。
     * @param {number} v
     */
    setRx(v: number): Location;
    set ry(arg: number);
    /**
     * 此位置对应的 yaw 角。
     * @type {number}
     */
    get ry(): number;
    /**
     * 设置此位置对应的 yaw 角。
     * @param {number} v
     */
    setRy(v: number): Location;
    set dimension(arg: YoniDimension);
    /**
     * 此位置所在的维度。
     * @type {YoniDimension}
     */
    get dimension(): YoniDimension;
    /**
     * 设置此位置所在的维度
     * @param {number|string|Minecraft.Dimension|YoniDimension|Dimension} v
     */
    setDimension(v: number | string | Minecraft.Dimension | YoniDimension | Dimension): Location;
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
     * 将坐标设置为原点
     */
    zero(): Location;
    /**
     * @param {Location1Arg} loc
     */
    distance(loc: Location1Arg): number;
    /**
     * @param {Location1Arg} loc
     */
    distancrSquared(loc: Location1Arg): number;
    getLength(): void;
    getLengthSquared(): void;
    toVector(): void;
    getDirection(): void;
    setDirection(): void;
    /**
     * @returns {YoniBlock} 此位置上的方块
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
    getVanillaBlockLocation(): Minecraft.BlockLocation;
    /**
     * @returns {Minecraft.Location} 根据此位置创建一个原版的Minecraft.Location
     */
    getVanillaLocation(): Minecraft.Location;
    getVanillaVector(): Minecraft.Vector;
    isLoaded(): void;
    getChunk(): void;
    checkFinite(): void;
    /**
     * @param {Location1Arg} loc
     */
    equals(loc: Location1Arg): boolean;
    /**
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
    #private;
}
import { Minecraft } from "./basis.js";
import { Dimension } from "./dimension.js";
import { YoniDimension } from "./dimension.js";
import { YoniBlock } from "./block.js";
