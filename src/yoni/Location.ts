import { Minecraft } from "./basis.js";
import { Dimension, YoniDimension } from "./dimension.js";
import { Block, YoniBlock } from "./block.js";
import { DimensionLikeValue, isDimensionValue } from "./dim.js";
import { getNumber as getFiniteNumber } from "./lib/getNumber.js";

/**
 * 代表Minecraft中的特定位置，其中包含维度，坐标，旋转角。
 */
export class Location {

    static #zero?: Location;
    
    /**
     * 处于零点的Location对象。
     */
    static get zero(): Location {
        if (Location.#zero === undefined)
            Location.#zero = new Location(0, 0, 0);
        
        return Location.#zero.clone();
    }
    static #checkReadOnly(location: Location){
        if (location.#readOnly){
            throw new TypeError("Read-only Location Object");
        }
    }
    static normalizePitch(num: number): number {
        num = getFiniteNumber(num);
        num += 180;
        num = num % 360;
        num -= 180;
        return num;
    }
    static normalizeYaw(num: number): number {
        num = getFiniteNumber(num);
        num += 180;
        num = num % 360;
        num -= 180;
        return num;
    }
    
    #readOnly = false;
    get readOnly(){
        return this.#readOnly;
    }
    
    // @ts-ignore
    #dimension: YoniDimension = null;
    
    #x: number = NaN;
    #y: number = NaN;
    #z: number = NaN;
    
    #rx = 0;
    #ry = 0;
    
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param x
     * @returns 返回此位置本身。
     */
    setX(x: any){
        Location.#checkReadOnly(this);
        this.#x = getFiniteNumber(x);
        return this;
    }
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param y
     * @returns 返回此位置本身。
     */
    setY(y: any){
        Location.#checkReadOnly(this);
        this.#y = getFiniteNumber(y);
        return this;
    }
    /**
     * 设置此位置对应的 z 轴坐标。
     * @param z
     * @returns 返回此位置本身。
     */
    setZ(z: any){
        Location.#checkReadOnly(this);
        this.#z = getFiniteNumber(z);
        return this;
    }
    setPosition(coords: Coords): void;
    /**
     * 设置此位置对应的坐标。
     * @param x
     * @param y
     * @param z
     * @returns 返回此位置本身。
     */
    setPosition(x: number, y: number, z: number): void;
    setPosition(...args: [ Coords ] | [ ...CoordsArray ]){
        let x: number, y: number, z: number;
        if (args.length === 1)
            ({x, y, z} = args[0]);
        else
            ([x, y, z] = args);
        
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /**
     * 设置此位置对应的 pitch 角。
     * @param rx
     * @returns 返回此位置本身。
     */
    setRx(rx: any){
        Location.#checkReadOnly(this);
        this.#rx = Location.normalizePitch(rx);
        return this;
    }
    /**
     * 设置此位置对应的 yaw 角。
     * @param {number} v
     */
    setRy(ry: any){
        Location.#checkReadOnly(this);
        this.#ry = Location.normalizeYaw(ry);
        return this;
    }
    setRotation(rotation: Vector2): void;
    /**
     * 设置此位置对应的旋转角。
     * @param rx
     * @param ry
     * @returns 返回此位置本身。
     */
    setRotation(rx: number, ry: number): void;
    setRotation(...args: [ Vector2 ] | [ ...RotationArray ]){
        let x: number, y: number;
        if (args.length === 1)
            ({x, y} = args[0]);
        else
            ([x, y] = args);
        
        this.rx = x;
        this.ry = y;
        return this;
    }
    /**
     * 设置此位置所在的维度
     * @param dim
     */
    setDimension(dim: DimensionLikeValue){
        Location.#checkReadOnly(this);
        this.#dimension = Dimension.toDimension(dim);
        return this;
    }
    
    get x(): number {
        return this.#x;
    }
    set x(x){
        this.setX(x);
    }
    get y(): number {
        return this.#y;
    }
    set y(y){
        this.setY(y);
    }
    get z(): number {
        return this.#z;
    }
    set z(z){
        this.setZ(z);
    }
    get rx(): number {
        return this.#rx;
    }
    set rx(rx){
        this.setRx(rx);
    }
    get ry(): number {
        return this.#ry;
    }
    set ry(ry){
        this.setRy(ry);
    }
    /**
     * 此位置所处的维度。
     */
    get dimension(): YoniDimension {
        return this.#dimension;
    }
    set dimension(dim){
        this.setDimension(dim);
    }
    
    //魔法代码，用于快速复制Location对象
    static #magicCloneSymbol = {x: 0, y: 0, z: 0};
    
    constructor(locationInfo: LocationInfo);

    constructor(positionPointInfo: PositionPointInfo);

    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number, rotationX: number, rotationY: number);
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: Vector2);
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: Rotation);
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: RotationArray);
    constructor(dimension: DimensionLikeValue, x: number, y: number, z: number);
    
    constructor(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotationX: number, rotationY: number);
    constructor(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: Vector2);
    constructor(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: Rotation);
    constructor(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: RotationArray);
    constructor(positionInfoArray: [DimensionLikeValue, ...CoordsArray]);
    
    constructor(position: DimensionPosition, rotationX: number, rotationY: number);
    constructor(position: DimensionPosition, rotation: Vector2);
    constructor(position: DimensionPosition, rotation: Rotation);
    constructor(position: DimensionPosition, rotation: RotationArray);
    constructor(position: DimensionPosition);

    constructor(position: PositionInfo, rotationX: number, rotationY: number);
    constructor(position: PositionInfo, rotation: Vector2);
    constructor(position: PositionInfo, rotation: Rotation);
    constructor(position: PositionInfo, rotation: RotationArray);
    constructor(position: PositionInfo);

    constructor(dimension: DimensionLikeValue, coords: CoordsArray, rotationX: number, rotationY: number);
    constructor(dimension: DimensionLikeValue, coords: CoordsArray, rotation: Vector2);
    constructor(dimension: DimensionLikeValue, coords: CoordsArray, rotation: Rotation);
    constructor(dimension: DimensionLikeValue, coords: CoordsArray, rotation: RotationArray);
    constructor(dimension: DimensionLikeValue, coords: CoordsArray);

    constructor(dimension: DimensionLikeValue, coords: Coords, rotationX: number, rotationY: number);
    constructor(dimension: DimensionLikeValue, coords: Coords, rotation: Vector2);
    constructor(dimension: DimensionLikeValue, coords: Coords, rotation: Rotation);
    constructor(dimension: DimensionLikeValue, coords: Coords, rotation: RotationArray);
    constructor(dimension: DimensionLikeValue, coords: Coords);

    constructor(x: number, y: number, z: number, rotationX: number, rotationY: number);
    constructor(x: number, y: number, z: number, rotation: Vector2);
    constructor(x: number, y: number, z: number, rotation: Rotation);
    constructor(x: number, y: number, z: number, rotation: RotationArray);
    constructor(x: number, y: number, z: number);
    
    constructor(coordsArray: CoordsArray, rotationX: number, rotationY: number);
    constructor(coordsArray: CoordsArray, rotation: Vector2);
    constructor(coordsArray: CoordsArray, rotation: Rotation);
    constructor(coordsArray: CoordsArray, rotation: RotationArray);
    constructor(coordsArray: CoordsArray);
    
    constructor(coords: Coords, rotationX: number, rotationY: number);
    constructor(coords: Coords, rotation: Vector2);
    constructor(coords: Coords, rotation: Rotation);
    constructor(coords: Coords, rotation: RotationArray);
    constructor(coords: Coords);

    constructor(locationPointInfoArray: [ ...CoordsArray, ...RotationArray ]);
    constructor(uncertainOneParam: LocationParamsOneArg);
    /**
     * 创建一个代表MC中特定位置的对象。其中包括维度，坐标，旋转角。
     
     * 可以以多种形式传递参数来构造一个Location。
     * 例如，大部分原版中需要一个位置的值。（Block, Entity）
     * 符合${link Vector3}的对象也可以传入。
     *
     * 参数传递顺序一般遵循以下规则：
     *
     * - 先维度，后坐标，最后旋转角。
     *
     * - 坐标先x，之后是y，最后是z，必须连续指定。
     *
     * - 旋转角先是rx，后是ry，必须连续指定。
     * 
     * 至少需要传入可以表示一个坐标的参数。
     *
     * 如果传入的参数中并不能读取到特定的值，则使用默认值补充。
     * 
     * 注意，现在允许的参数类型中，包含尚未支持的类型 {@link Rotation}，这是因为我想支持这种，但是还没支持，先写了上去。
     */
    constructor(...values: LocationParams){
        
        //使用此标志以加快复制对象的速度
        if (arguments[0] === Location.#magicCloneSymbol)
            return;
        
        let { x, y, z, rx, ry, dimension } = makeLocation(values);
        
        this.setPosition(x, y, z);
        
        if (rx !== undefined){
            this.rx = rx;
        }
        if (ry !== undefined){
            this.ry = ry;
        }
        
        if (dimension == null){
            this.setDimension("minecraft:overworld");
        } else {
            this.setDimension(dimension);
        }
    }
    
    add(value: LocationParamsOneArg){
        let { x, y, z } = makeLocation([value]);
        let location = this.clone();
        location.x += x;
        location.y += y;
        location.z += z;
        return location;
    }
    subtract(value: LocationParamsOneArg){
        let { x, y, z } = makeLocation([value]);
        let location = this.clone();
        location.x -= x;
        location.y -= y;
        location.z -= z;
        return location;
    }
    multiply(value: LocationParamsOneArg){
        let { x, y, z } = makeLocation([value]);
        let location = this.clone();
        location.x *= x;
        location.y *= y;
        location.z *= z;
        return location;
    }
    /**
     * 复制一个Location对象，然后将坐标设置为原点。
     */
    zero(){
        let location = this.clone();
        location.x = 0;
        location.y = 0;
        location.z = 0;
        return location;
    }
    
    /**
     * 计算此坐标与指定位置的距离。
     */
    distance(loc: LocationParamsOneArg){
        let distance = this.distanceSquared(loc);
        return Math.sqrt(distance);
    }
    distanceSquared(loc: LocationParamsOneArg){
        let fromLocation = makeLocation([loc]);
        let { x, y, z } = this;
        let distance = 0;
        distance += Math.abs(fromLocation.x ** 2 - x ** 2);
        distance += Math.abs(fromLocation.y ** 2 - y ** 2);
        distance += Math.abs(fromLocation.z ** 2 - z ** 2);
        return distance;
    }
    getLength(){
        return this.distance(Location.zero);
    }
    getLengthSquared(){
        return this.distanceSquared(Location.zero);
    }
    
    /**
     * @param {number} v
     */
    toFixed(v: number){
        let { dimension, x, y, z, rx, ry } = this;
        let loc = this.clone();
        return loc.setX(x.toFixed(v))
            .setY(y.toFixed(v))
            .setZ(z.toFixed(v))
            .setRx(rx.toFixed(v))
            .setRy(ry.toFixed(v));
    }
    toVector(){
        return this.getVanillaVector();
    }
    getDirection(){
        throw new Error("not implemented yet");
    }
    setDirection(){
        throw new Error("not implemented yet");
    }
    
    /**
     * @returns 此位置上的方块。
     */
    getBlock(): YoniBlock {
        return this.dimension.getBlock(this);
    }
    getBlockX(){
        return Math.floor(this.x);
    }
    getBlockY(){
        return Math.floor(this.y);
    }
    getBlockZ(){
        return Math.floor(this.z);
    }
    /**
     * 返回一个取整后的坐标，且旋转角为0
     */
    toBlockLocation(){
        const location = this.clone();
        const { x, y, z, rx, ry } = location;
        location.x = Math.floor(x);
        location.y = Math.floor(y);
        location.z = Math.floor(z);
        location.rx = 0;
        location.ry = 0;
        return location;
    }
    /**
     * 返回一个在此坐标上进行指定偏移后的Location
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    offset(x: number, y: number, z: number){
        const location = this.clone();
        location.x += x;
        location.y += y;
        location.z += z;
        return location;
    }
    
    /**
     * @returns {Minecraft.BlockLocation} 根据此位置创建一个原版的Minecraft.BlockLocation
     */
    getVanillaBlockLocation(){
        let { x, y, z } = this;
        x = Math.floor(x);
        y = Math.floor(y);
        z = Math.floor(z);
        return { x, y, z };
    }
    /**
     * @returns {Minecraft.Location} 根据此位置创建一个原版的Minecraft.Location
     */
    getVanillaLocation(){
        let { x, y, z } = this;
        return { x, y, z };
    }
    getVanillaVector(){
        let { x, y, z } = this;
        return new Minecraft.Vector(x, y, z);
    }
    isLoaded(){
        try {
            this.getBlock();
            return true;
        } catch {
            return false;
        }
    }
    getChunk(){
        throw new Error("not implemented yet");
    }
    
    checkFinite(){
        throw new Error("not implemented yet");
    }
    /**
     * 判断传入的位置是否与此位置对象代表的位置相同。
     */
    equals(loc: LocationParamsOneArg){
        let fromLocation = new Location(loc);
        let { x, y, z, rx, ry, dimension } = this;
        
        return fromLocation.x === x
        && fromLocation.y === y
        && fromLocation.z === z
        && fromLocation.rx === rx
        && fromLocation.ry === ry
        && fromLocation.dimension === dimension;
    }
    /**
     * 判断传入的位置的坐标是否与此位置对象代表的坐标相同。
     */
    equalsPosition(loc: LocationParamsOneArg){
        let fromLocation = new Location(loc);
        let { x, y, z } = this;
        
        return fromLocation.x === x
        && fromLocation.y === y
        && fromLocation.z === z;
    }
    clone(){
        const location = new Location(Location.#magicCloneSymbol);
        location.#x = this.#x;
        location.#y = this.#y;
        location.#z = this.#z;
        location.#rx = this.#rx;
        location.#ry = this.#ry;
        location.#dimension = this.#dimension;
        return location;
    }
    
    toString(){
        return "Location: " + JSON.stringify(this);
    }
    toJSON(){
        let { x, y, z, rx, ry } = this;
        let dimension = this.dimension.id;
        return { x, y, z, rx, ry, dimension };
    }
    static fromBlock(block: Minecraft.Block | YoniBlock){
        return new Location(block.dimension, block.x, block.y, block.z, 0, 0);
    }
    
    /**
     * 将一个Location对象转换为一段字符串
     * @param {Location} v 
     * @returns {string}
     */
    static serialize(v: Location){
        return JSON.stringify(v);
    }
    /**
     * 将一段由Location对象转换后的字符串转换为Location对象
     * @param {string} v 
     * @returns {Location}
     */
    static deserialize(v: string){
        return new Location(JSON.parse(v) as unknown as LocationParamsOneArg);
    }
    
    static createReadonly(locationInfo: LocationInfo): Readonly<Location>;

    static createReadonly(positionPointInfo: PositionPointInfo): Readonly<Location>;

    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: Vector2): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: Rotation): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number, rotation: RotationArray): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, x: number, y: number, z: number): Readonly<Location>;
    
    static createReadonly(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: Vector2): Readonly<Location>;
    static createReadonly(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: Rotation): Readonly<Location>;
    static createReadonly(positionInfoArray: [DimensionLikeValue, ...CoordsArray], rotation: RotationArray): Readonly<Location>;
    static createReadonly(positionInfoArray: [DimensionLikeValue, ...CoordsArray]): Readonly<Location>;
    
    static createReadonly(position: DimensionPosition, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(position: DimensionPosition, rotation: Vector2): Readonly<Location>;
    static createReadonly(position: DimensionPosition, rotation: Rotation): Readonly<Location>;
    static createReadonly(position: DimensionPosition, rotation: RotationArray): Readonly<Location>;
    static createReadonly(position: DimensionPosition): Readonly<Location>;

    static createReadonly(position: PositionInfo, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(position: PositionInfo, rotation: Vector2): Readonly<Location>;
    static createReadonly(position: PositionInfo, rotation: Rotation): Readonly<Location>;
    static createReadonly(position: PositionInfo, rotation: RotationArray): Readonly<Location>;
    static createReadonly(position: PositionInfo): Readonly<Location>;

    static createReadonly(dimension: DimensionLikeValue, coords: CoordsArray, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: CoordsArray, rotation: Vector2): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: CoordsArray, rotation: Rotation): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: CoordsArray, rotation: RotationArray): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: CoordsArray): Readonly<Location>;

    static createReadonly(dimension: DimensionLikeValue, coords: Coords, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: Coords, rotation: Vector2): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: Coords, rotation: Rotation): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: Coords, rotation: RotationArray): Readonly<Location>;
    static createReadonly(dimension: DimensionLikeValue, coords: Coords): Readonly<Location>;

    static createReadonly(x: number, y: number, z: number, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number, rotation: Vector2): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number, rotation: Rotation): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number, rotation: RotationArray): Readonly<Location>;
    static createReadonly(x: number, y: number, z: number): Readonly<Location>;
    
    static createReadonly(coordsArray: CoordsArray, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(coordsArray: CoordsArray, rotation: Vector2): Readonly<Location>;
    static createReadonly(coordsArray: CoordsArray, rotation: Rotation): Readonly<Location>;
    static createReadonly(coordsArray: CoordsArray, rotation: RotationArray): Readonly<Location>;
    static createReadonly(coordsArray: CoordsArray): Readonly<Location>;
    
    static createReadonly(coords: Coords, rotationX: number, rotationY: number): Readonly<Location>;
    static createReadonly(coords: Coords, rotation: Vector2): Readonly<Location>;
    static createReadonly(coords: Coords, rotation: Rotation): Readonly<Location>;
    static createReadonly(coords: Coords, rotation: RotationArray): Readonly<Location>;
    static createReadonly(coords: Coords): Readonly<Location>;

    static createReadonly(locationPointInfoArray: [ ...CoordsArray, ...RotationArray ]): Readonly<Location>;
    static createReadonly(uncertainOneParam: LocationParamsOneArg): Readonly<Location>;
    /**
     * 创建一个只读的Location对象。
     * @returns {Readonly<Location>}
     */
    static createReadonly(...values: LocationParams){
        let location = new Location(
            // @ts-ignore 我不知道该怎么解决这个问题，所以只好忽略了
            ...values);
        location.#readOnly = true;
        return location as unknown as Readonly<Location>;
    }
    /**
     * 使用Location创建创建一个只读的Location对象。
     * @param {Location} location
     * @returns {Readonly<Location>}
     */
    static makeReadonly(location: Location){
        location = location.clone();
        location.#readOnly = true;
        return location as unknown as Readonly<Location>;
    }
    static blocksBetween(start: LocationParamsOneArg, end: LocationParamsOneArg){
        let startPoint = new Location(start).toBlockLocation();
        let endPoint = new Location(end).toBlockLocation();
        
        let { x0, x1, y0, y1, z0, z1 } = (function (){
            let { x: x2, y: y2, z: z2 } = startPoint;
            let { x: x3, y: y3, z: z3 } = endPoint;
            
            let x0, x1, y0, y1, z0, z1;
            
            x0 = Math.min(x2, x3);
            y0 = Math.min(y2, y3);
            z0 = Math.min(z2, z3);

            x1 = Math.max(x2, x3);
            y1 = Math.max(y2, y3);
            z1 = Math.max(z2, z3);
            
            return { x0, x1, y0, y1, z0, z1 };
        })();
        
        let offset = Location.zero;
        
        startPoint = startPoint.zero()
            .add([x0, y0, z0]);
        endPoint = endPoint.zero()
            .add([x1, y1, z1]);
        
        let areaSize = endPoint.subtract(startPoint)
            .add([1, 1, 1]);
        
        let blocks = [];
        for (let x = 0; x < areaSize.x; x++){
            for (let y = 0; y < areaSize.y; y++){
                for (let z = 0; z < areaSize.z; z++){
                    blocks.push(startPoint.add([x, y, z]));
                }
            }
        }
        
        return blocks;
    }
}

import { FunctionParamsOverrides } from "./lib/FunctionParamsOverrides.js";

const overrides = new FunctionParamsOverrides();
function requireDimensionValue(argc: 1, args: any[]){
    const value = args[0];
    return isDimensionValue(value);
}
function requireVector3Object(argc: 1, args: any[]){
    const { x, y, z } = args[0];
    return "number" === typeof x 
        && "number" === typeof y
        && "number" === typeof z;
}
function requireVector3Array(argc: 1, args: any[]){
    const vec3arr = args[0];
    const x = vec3arr[0];
    const y = vec3arr[1];
    const z = vec3arr[2];
    return "number" === typeof x 
        && "number" === typeof y
        && "number" === typeof z;
}
function requireVector3(argc: 3, args: any[]){
    return requireVector3Array(1, [args]);
}

function requireVector2Object(argc: 1, args: any[]){
    const { x, y } = args[0];
    return "number" === typeof x 
        && "number" === typeof y;
}
function requireVector2Array(argc: 1, args: any[]){
    const vec2arr = args[0];
    const x = vec2arr[0];
    const y = vec2arr[1];
    return "number" === typeof x 
        && "number" === typeof y;
}
function requireVector2(argc: 2, args: any[]){
    return requireVector2Array(1, [args]);
}

function requireRotation(argc: 1, args: any[]){
    const { rx, ry } = args[0];
    return "number" === typeof rx 
        && "number" === typeof ry;
}

function requireObjectWithDimensionAndCoords(argc: 1, args: any[]){
    return requireDimensionValue(1, [args[0].dimension])
        && requireVector3Object(1, [args[0].location]);
}


function requireObjectWithDimensionAndVector3(argc: 1, args: any[]){
    return requireDimensionValue(1, [args[0].dimension])
        && requireVector3Object(1, args);
}


function requireArrayWithVector3AndVector2(argc: 1, args: any[]){
    const loc = args[0];
    
    return requireVector3(3, Array.prototype.slice.call(args[0], 0, 3))
    && requireVector2(2, Array.prototype.slice.call(args[0], 3, 2));
}

function requireArrayWithDimensionAndVector3(argc: 1, args: any[]){
    const loc = args[0];
    
    return requireDimensionValue(1, args[0])
    && requireVector3(3, Array.prototype.slice.call(args[0], 1, 3));
}

function requireEntityObject(argc: 1, args: any[]){
    const entity = args[0];
    let { location, dimension, rotation } = entity;
    if (!rotation && "function" === typeof entity.getRotation){
        try {
            rotation = entity.getRotation();
        } catch {
            //no thing to do
        }
    }
    
    return location && rotation && dimension
      && requireVector3Object(1, [location])
      && requireVector2Object(1, [rotation])
      && requireDimensionValue(1, [dimension]);
}
function requireBlockObject(argc: 1, args: any[]){
    const block = args[0];
    return block && block.dimension
      && requireVector3Object(1, [block])
      && requireDimensionValue(1, [block.dimension]);
}

function requireObjectWithPositionAndRotationObject(argc: 1, args: any[]){
    const object = args[0];
    let { location, rotation } = object;
    if (!rotation && "function" === typeof object.getRotation){
        try {
            rotation = object.getRotation();
        } catch {}
    }
    
    return location && rotation
      && requireVector3Object(1, [location])
      && requireVector2Object(1, [rotation]);
}


// seq 1 variant 4
// high priority

overrides.addOverrides(
    [
        { argc: 1, condition: requireEntityObject }
    ],
    function (args: any[]){
        const entity = args[0];
        let { location, dimension, rotation } = entity;
        if (! rotation)
            rotation = entity.getRotation();
        const { x, y, z } = location;
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithPositionAndRotationObject }
    ],
    function (args: any[]){
        const entity = args[0];
        let { location, rotation } = entity;
        if (! rotation)
            rotation = entity.getRotation();
        const { x, y, z } = location;
        const rx = rotation.x;
        const ry = rotation.y;
        return { x, y, z, rx, ry };
    }
);

//see seq 1 variant 3 over 5
//same to only requireArrayWithDimensionAndVector3
/*

overrides.addOverrides(
    [
        { argc: 1, condition: requireBlockObject }
    ],
    function (args: any[]){
        const block = args[0];
        const { dimension, x, y, z } = blcok;
        return { dimension, x, y, z };
    }
);
*/

// seq 1

overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3 },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const dimension = args[0];
        const x = args[1];
        const y = args[2];
        const z = args[3];
        const rx = args[4];
        const ry = args[5];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const dimension = args[0];
        const x = args[1];
        const y = args[2];
        const z = args[3];
        const rocarr = args[4];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const dimension = args[0];
        const x = args[1];
        const y = args[2];
        const z = args[3];
        const { rx, ry } = args[4];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const dimension = args[0];
        const x = args[1];
        const y = args[2];
        const z = args[3];
        const rotation = args[4];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3 }
    ],
    function (args: any[]){
        const dimension = args[0];
        const x = args[1];
        const y = args[2];
        const z = args[3];
        return { dimension, x, y, z };
    }
);

// seq 1 variant 1

overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndVector3 },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const { dimension, x, y, z } = args[0];
        const rx = args[1];
        const ry = args[2];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndVector3 },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const { dimension, x, y, z } = args[0];
        const rocarr = args[1];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndVector3 },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const { dimension, x, y, z } = args[0];
        const { rx, ry } = args[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndVector3 },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const { dimension, x, y, z } = args[0];
        const rotation = args[1];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndVector3 }
    ],
    function (args: any[]){
        const { dimension, x, y, z } = args[0];
        return { dimension, x, y, z };
    }
);

// seq 1 variant 2

overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndCoords },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const { dimension, location } = args[0];
        const { x, y, z } = location;
        const rx = args[1];
        const ry = args[2];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndCoords },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const { dimension, location } = args[0];
        const { x, y, z } = location;
        const rocarr = args[1];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndCoords },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const { dimension, location } = args[0];
        const { x, y, z } = location;
        const { rx, ry } = args[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndCoords },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const { dimension, location } = args[0];
        const { x, y, z } = location;
        const rotation = args[1];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireObjectWithDimensionAndCoords },
    ],
    function (args: any[]){
        const { dimension, location } = args[0];
        const { x, y, z } = location;
        return { dimension, x, y, z };
    }
);

// seq 1 variant 3

overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithDimensionAndVector3 },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const location = args[0];
        const dimension = location[0];
        const x = location[1];
        const y = location[2];
        const z = location[3];
        const rx = args[1];
        const ry = args[2];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithDimensionAndVector3 },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const location = args[0];
        const dimension = location[0];
        const x = location[1];
        const y = location[2];
        const z = location[3];
        const rocarr = args[1];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithDimensionAndVector3 },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const location = args[0];
        const dimension = location[0];
        const x = location[1];
        const y = location[2];
        const z = location[3];
        const { rx, ry } = args[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithDimensionAndVector3 },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const location = args[0];
        const dimension = location[0];
        const x = location[1];
        const y = location[2];
        const z = location[3];
        const rotation = args[1];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithDimensionAndVector3 },
    ],
    function (args: any[]){
        const location = args[0];
        const dimension = location[0];
        const x = location[1];
        const y = location[2];
        const z = location[3];
        return { dimension, x, y, z };
    }
);

// seq 2

overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Object },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const dimension = args[0];
        const { x, y, z } = args[1];
        const rx = args[2];
        const ry = args[3];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const dimension = args[0];
        const { x, y, z } = args[1];
        const rocarr = args[2];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const dimension = args[0];
        const { x, y, z } = args[1];
        const { rx, ry } = args[2];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const dimension = args[0];
        const { x, y, z } = args[1];
        const rotation = args[2];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3Object }
    ],
    function (args: any[]){
        const dimension = args[0];
        const { x, y, z } = args[1];
        return { dimension, x, y, z };
    }
);

// seq 3

overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Array },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const dimension = args[0];
        const locarr = args[1];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rx = args[2];
        const ry = args[3];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const dimension = args[0];
        const locarr = args[1];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rocarr = args[2];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const dimension = args[0];
        const locarr = args[1];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const { rx, ry } = args[2];
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const dimension = args[0];
        const locarr = args[1];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rotation = args[2];
        const rx = rotation.x;
        const ry = rotation.y;
        return { dimension, x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireDimensionValue },
        { argc: 3, condition: requireVector3Array }
    ],
    function (args: any[]){
        const dimension = args[0];
        const locarr = args[1];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        return { dimension, x, y, z };
    }
);

// ------------------------

// seq 1-2

overrides.addOverrides(
    [
        { argc: 3, condition: requireVector3 },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const x = args[0];
        const y = args[1];
        const z = args[2];
        const rx = args[3];
        const ry = args[4];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const x = args[0];
        const y = args[1];
        const z = args[2];
        const rocarr = args[3];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const x = args[0];
        const y = args[1];
        const z = args[2];
        const { rx, ry } = args[3];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 3, condition: requireVector3 },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const x = args[0];
        const y = args[1];
        const z = args[2];
        const rotation = args[3];
        const rx = rotation.x;
        const ry = rotation.y;
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 3, condition: requireVector3 }
    ],
    function (args: any[]){
        const x = args[0];
        const y = args[1];
        const z = args[2];
        return { x, y, z };
    }
);

// seq 1-2 variant 1

overrides.addOverrides(
    [
        { argc: 1, condition: requireArrayWithVector3AndVector2 },
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rx = locarr[3];
        const ry = locarr[4];
        return { x, y, z, rx, ry };
    }
);

// seq 2-2

overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Object },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const { x, y, z } = args[0];
        const rx = args[1];
        const ry = args[2];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const { x, y, z } = args[0];
        const rocarr = args[1];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const { x, y, z } = args[0];
        const { rx, ry } = args[1];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Object },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const { x, y, z } = args[0];
        const rotation = args[1];
        const rx = rotation.x;
        const ry = rotation.y;
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Object }
    ],
    function (args: any[]){
        const { x, y, z } = args[0];
        return { x, y, z };
    }
);

// seq 3-2

overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Array },
        { argc: 2, condition: requireVector2 }
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rx = args[1];
        const ry = args[2];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireVector2Array }
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rocarr = args[1];
        const rx = rocarr[0];
        const ry = rocarr[1];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireRotation }
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const { rx, ry } = args[1];
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Array },
        { argc: 1, condition: requireVector2Object }
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        const rotation = args[1];
        const rx = rotation.x;
        const ry = rotation.y;
        return { x, y, z, rx, ry };
    }
);
overrides.addOverrides(
    [
        { argc: 1, condition: requireVector3Array }
    ],
    function (args: any[]){
        const locarr = args[0];
        const x = locarr[0];
        const y = locarr[1];
        const z = locarr[2];
        return { x, y, z };
    }
);

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export interface Vector2 {
    x: number;
    y: number;
}

export type Vector2Array = [ number, number ];
export type Vector3Array = [ number, number, number ];

export interface Coords extends Vector3 {}
export interface Position {
    location: Coords;
}
export interface DimensionPosition extends Position {
    dimension: DimensionLikeValue;
}
export type LocationInfo = (RotationGetter & DimensionPosition)
    | ( DimensionPosition & { rotation: Vector2 });
export type PositionPointInfo = (RotationGetter & Position)
    | ( Position & { rotation: Vector2 });

export interface PositionInfo extends Coords {
    dimension: DimensionLikeValue;
}

export interface Rotation {
    rx: number;
    ry: number;
}
export interface RotationGetter {
    getRotation(): Vector2;
}

export type CoordsArray = Vector3Array;
export type RotationArray = Vector2Array;

type LocationParams = 
    [ LocationInfo ]
    
    | [ PositionPointInfo ]
    
    | [ DimensionLikeValue, ...CoordsArray, ...RotationArray ]
    | [ DimensionLikeValue, ...CoordsArray, RotationArray ]
    | [ DimensionLikeValue, ...CoordsArray, Rotation ]
    | [ DimensionLikeValue, ...CoordsArray, Vector2 ]
    | [ DimensionLikeValue, ...CoordsArray ]
    
    | [ [DimensionLikeValue, ...CoordsArray], ...RotationArray ]
    | [ [DimensionLikeValue, ...CoordsArray], RotationArray ]
    | [ [DimensionLikeValue, ...CoordsArray], Rotation ]
    | [ [DimensionLikeValue, ...CoordsArray], Vector2 ]
    | [ [DimensionLikeValue, ...CoordsArray] ]
    
    | [ DimensionPosition, ...RotationArray ]
    | [ DimensionPosition, RotationArray ]
    | [ DimensionPosition, Rotation ]
    | [ DimensionPosition, Vector2 ]
    | [ DimensionPosition ]
    
    | [ PositionInfo, ...RotationArray ]
    | [ PositionInfo, RotationArray ]
    | [ PositionInfo, Rotation ]
    | [ PositionInfo, Vector2 ]
    | [ PositionInfo ]
    
    | [ DimensionLikeValue, CoordsArray, ...RotationArray ]
    | [ DimensionLikeValue, CoordsArray, RotationArray ]
    | [ DimensionLikeValue, CoordsArray, Rotation ]
    | [ DimensionLikeValue, CoordsArray, Vector2 ]
    | [ DimensionLikeValue, CoordsArray ]
    
    | [ DimensionLikeValue, Coords, ...RotationArray ]
    | [ DimensionLikeValue, Coords, RotationArray ]
    | [ DimensionLikeValue, Coords, Rotation ]
    | [ DimensionLikeValue, Coords, Vector2 ]
    | [ DimensionLikeValue, Coords ]
    
    | [ ...CoordsArray, ...RotationArray ]
    | [ ...CoordsArray, RotationArray ]
    | [ ...CoordsArray, Rotation ]
    | [ ...CoordsArray, Vector2 ]
    | [ ...CoordsArray ]
    | [ CoordsArray, ...RotationArray ]
    | [ CoordsArray, RotationArray ]
    | [ CoordsArray, Rotation ]
    | [ CoordsArray, Vector2 ]
    | [ CoordsArray ]
    | [ Coords, ...RotationArray ]
    | [ Coords, RotationArray ]
    | [ Coords, Rotation ]
    | [ Coords, Vector2 ]
    | [ Coords ]
    
    | [ [ ...CoordsArray, ...RotationArray ] ]
    | [ LocationParamsOneArg ] /* 为了让ts识别的轻松一点 */

export type LocationParamsOneArg = 
    [DimensionLikeValue, ...CoordsArray]
    | DimensionPosition
    | PositionInfo
    | LocationInfo
    | CoordsArray
    | Coords
    | [ ...CoordsArray, ...RotationArray ]

function makeLocation(values: LocationParams){
    let overrideMathces = overrides.match(values);
    
    if (!overrideMathces?.hasResult)
        throw new TypeError("没有匹配结果，无法创建对应的位置对象");
    
    return overrideMathces.result;
}
