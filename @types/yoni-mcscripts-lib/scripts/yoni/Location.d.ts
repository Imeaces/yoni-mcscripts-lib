import { Minecraft } from "./basis.js";
/**
 * 一个复杂点的Location类
 */
declare class Location {
    #private;
    /**
     * @param {number} v
     * @returns {number}
     */
    static normalizePitch(v: any): any;
    /**
     * @param {number} v
     * @returns {number}
     */
    static normalizeYaw(v: any): any;
    /**
     * @type {number}
     */
    get x(): number;
    set x(v: number);
    /**
     * @type {number}
     */
    get y(): number;
    set y(v: number);
    /**
     * @type {number}
     */
    get z(): number;
    set z(v: number);
    /**
     * @type {number}
     */
    get rx(): number;
    set rx(v: number);
    /**
     * @type {number}
     */
    get ry(): number;
    set ry(v: number);
    /**
     * @type {Minecraft.Dimension}
     */
    get dimension(): any;
    /**
     * @param {number|string|Minecraft.Dimension} v
     */
    set dimension(v: any);
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
    constructor(...values: any[]);
    /**
     * @param {LocationParams} values
     */
    add(...values: any[]): this;
    /**
     * @param {LocationParams} values
     */
    subtract(...values: any[]): this;
    /**
     * @param {LocationParams} values
     */
    multiply(...values: any[]): this;
    /**
     * 将坐标设置为原点
     */
    zero(): this;
    /**
     * @param {Location1Arg} loc
     */
    distance(loc: any): number;
    /**
     * @param {Location1Arg} loc
     */
    distancrSquared(loc: any): number;
    getLength(): void;
    getLengthSquared(): void;
    toVector(): void;
    getDirection(): void;
    setDirection(): void;
    /**
     * @returns {Minecraft.Block} 此位置上的方块
     */
    getBlock(): any;
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
    offset(x: any, y: any, z: any): Location;
    /**
     * @returns {Minecraft.BlockLocation} 根据此位置创建一个原版的Minecraft.BlockLocation
     */
    getVanillaBlockLocation(): this | Minecraft.BlockLocation;
    /**
     * @returns {Minecraft.Location} 根据此位置创建一个原版的Minecraft.Location
     */
    getVanillaLocation(): this | Minecraft.Location;
    getVanillaVector(): Minecraft.Vector;
    isLoaded(): void;
    getChunk(): void;
    checkFinite(): void;
    /**
     * @param {Location1Arg} loc
     */
    equals(loc: any): boolean;
    /**
     * @param {Location1Arg} loc
     */
    equalsPosition(loc: any): boolean;
    clone(): Location;
    toString(): string;
    toJSON(): {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        dimension: any;
    };
    /**
     * 将一个Location对象转换为一段字符串
     * @param {Location} v
     * @returns {string}
     */
    static serialize(v: any): string;
    /**
     * 将一段由Location对象转换后的字符串转换为Location对象
     * @param {string} v
     * @returns {Location}
     */
    static deserialize(v: any): Location;
}
export default Location;
export { Location };
