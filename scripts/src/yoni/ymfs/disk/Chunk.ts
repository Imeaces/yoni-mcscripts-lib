import { Minecraft } from "../../basis.js";
import { YoniBlock } from "../../block.js";
import { Location } from "../../Location.js";
import { ChunkBlock } from "./ChunkBlock.js";
import { Volume } from "./Volume.js";

export class Chunk {
    readonly location: Readonly<Location>;
    readonly mblock: YoniBlock;
    readonly mcontainer: Minecraft.Container;
    readonly index: number;
    readonly volume: Volume;
    get size(){
        return this.mcontainer.size;
    }
    get asyncVolumeSystem(): boolean {
        return this.volume.asyncVolumeSystem;
    }
    dataCaches: (undefined | string[])[];
    constructor(volume: Volume, index: number, location: Location){
        this.volume = volume;
        this.index = index;
        this.location = Location.makeReadonly(location);
        this.mblock = this.location.getBlock();
        let inventory = this.mblock.getComponent("minecraft:inventory") as Minecraft.BlockInventoryComponent;
        if (inventory == null){
            throw new Error("chunk mblock don't hava inventory component");
        }
        this.mcontainer = inventory.container;
        this.dataCaches = new Array(this.size);
    }
    /**
     * 获取代表此区块上指定的块对象。
     * @param {string} dataStr - 要存储在此块上的数据字符串。
     */
     getBlock(index: number): ChunkBlock {
        if (index < 0
        || index >= this.size
        || Math.floor(index) !== index)
            throw new RangeError("no block at the index "+index);
        
        let block = new ChunkBlock(this, index);
        
        return block;
    }
    saveData(index: number, strArr: string[], noCache: boolean = false){
        let invalidValue = strArr.find(v => String(v).indexOf("\u0000") !== -1);
        if (invalidValue !== undefined){
            throw new RangeError("char '\\u0000' is not allowed");
        }
        if (this.asyncVolumeSystem && !noCache){
            this.volume._addCache(this.index, this);
            this.dataCaches[index] = Array.from(strArr);
        } else {
            let mitem = new Minecraft.ItemStack("minecraft:stone");
            mitem.setLore(strArr);
            this.mcontainer.setItem(index, mitem);
        }
    }
    readData(index: number, noCache: boolean = false): string[] {
        if (this.asyncVolumeSystem && !noCache){
            let cache = this.dataCaches[index];
            if (cache){
                return Array.from(cache);
            }
        }
        let mitem = this.mcontainer.getItem(index);
        let strArr: string[];
        if (mitem != null){
            strArr = mitem.getLore();
        } else {
            strArr = [];
        }
        
        if (this.asyncVolumeSystem && !noCache){
            this.volume._addCache(this.index, this);
            this.dataCaches[index] = Array.from(strArr);
        }
        
        return strArr;
    }
    flush(){
    }
    /**
     * 读取块上存入的字符串。
     * @returns {string} 此块上存储的数据字符串。
     */
    getDataStr(index: number): string {
        return this.readData(index).join("\u0000");
    }
    /**
     * 将字符串写入到指定的的块。
     * @param {string} dataStr - 要存储在此块上的数据字符串。
     */
    setDataStr(index: number, dataStr: string): void {
        this.saveData(index, String(dataStr).split("\u0000"));
    }
    
    /**
     * 将数据写入到指定的的块。
     * @param {ArrayBuffer} buffer - 要存储在此块上的数据。
     */
    setData(index: number, buffer: ArrayBuffer): void {
        let view = new Uint8Array(buffer);
        let dataStr = Array.prototype.map.call(view, b => String.fromCodePoint(b)).join("");
        this.setDataStr(index, dataStr);
    }
    /**
     * 读取块上的数据。
     * @param {ArrayBuffer} [buffer] - 若指定，将此块上的数据写入此缓冲区。
     * @returns {ArrayBuffer} 此块上存储的数据。
     */
    getData(index: number, buffer?: ArrayBuffer): ArrayBuffer {
        //读取数据字符串
        let dataStr = this.getDataStr(index);
        
        //将字符串转换为一串数字
        let data: number[] = dataStr.split("")
            .map((c: string) => (c.codePointAt(0) as number) % 256);
        
        //若指定，将数据截断为缓冲区的长度，否则创建新的缓冲区
        if (buffer instanceof ArrayBuffer){
            if (buffer.byteLength < data.length){
                data.length = buffer.byteLength;
            }
        } else {
            buffer = new ArrayBuffer(data.length);
        }
        
        //通过视图向缓冲区写入数据
        let view = new Uint8Array(buffer);
        
        data.forEach((byte, index) => {
            view[index] = byte;
        });
        
        return buffer;
    }
    
    getStringArray(block: number): string[] {
        return this.getDataStr(block).split("\u0000");
    }
    setStringArray(block: number, arr: string[]): void {
        if (arr.filter(v => v.indexOf("\u0000") !== -1).length !== 0){
            throw new RangeError("char '\\u0000' is not allowed");
        }
        this.setDataStr(block, arr.join("\u0000"));
    }
    * entries(): Generator<[number, string]> {
        for (let index = 0; index < this.size; index++){
            yield [index, this.getDataStr(index)];
        }
    }
}
