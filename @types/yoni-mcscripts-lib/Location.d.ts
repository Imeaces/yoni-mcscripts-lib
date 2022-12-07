export default Location;
/**
 * 一个复杂点的Location类
 */
export class Location {
    static normalizePitch(v: any): any;
    static normalizeYaw(v: any): any;
    static serialize(v: any): void;
    static deserialize(v: any): void;
    /**
     * 必须可以匹配到x, y, z
     * 目前可以匹配以下类型的位置
     * dimension, x, y, z, rx, ry
     * x, y, z, rx, ry
     * dimension, x, y, z
     *
     * dimension, {x, y, z}, {rx, ry}
     * dimension, [x, y, z], [rx, ry]
     * dimension, {x, y, z}, [rx, ry]
     * x, y, z
     *
     * {dimension, x, y, z} [rx, ry]
     * {dimension, x, y, z} {rx, ry}
     * dimension, [ x, y, z, rx, ry]
     * dimension, {x, y, z, rx, ry}
     * dimension, {x, y, z}
     * dimension, [x, y, z]
     *
     * {dimension, x, y, z, rx, ry}
     * [dimension, x, y, z, rx, ry]
     * {x, y, z, rx, ry}
     * {x, y, z}
     * [x, y, z, rx, ry]
     * [x, y, z]
     * {dimension, location, rotation}
     * {dimension, location}
     */
    constructor(...values: any[]);
    set x(arg: number);
    get x(): number;
    set y(arg: number);
    get y(): number;
    set z(arg: number);
    get z(): number;
    set rx(arg: number);
    get rx(): number;
    set ry(arg: number);
    get ry(): number;
    set dimension(arg: null);
    get dimension(): null;
    add(...values: any[]): Location;
    subtract(...values: any[]): Location;
    multiply(...values: any[]): Location;
    zero(): Location;
    distance(loc: any): number;
    distancrSquared(loc: any): number;
    getLength(): void;
    getLengthSquared(): void;
    toVector(): void;
    getDirection(): void;
    setDirection(): void;
    getBlock(): any;
    getBlockX(): void;
    getBlockY(): void;
    getBlockZ(): void;
    toBlockLocation(): Location;
    isLoaded(): void;
    getChunk(): void;
    checkFinite(): void;
    equals(loc: any): boolean;
    clone(): Location;
    toString(): Object;
    toJSON(): {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        dimension: any;
    };
    #private;
}
