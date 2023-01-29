import { ScoreboardObjectiveEntryIndexMapper } from "./n0_block_device_raw_addr.js";
/**
 * an array-like object that contains a set of number, each number means 1 byte
 * @typedef IByteArray
 * @property {number} length - length of byte array
 */
export declare class ByteBlock {
    #private;
    get identity(): any;
    get length(): number;
    set length(v: number);
    constructor(blockId: any, mapper?: ScoreboardObjectiveEntryIndexMapper);
    static getPositionBetweensPosition4Range(position: number, length: number, totalLength: number): Position4Range;
    read(position: number, length: number): number[];
    write(buffer: any, position: any, length?: any): void;
    trim(position: any, length: any): void;
    trim4(position4: any): void;
    seek(offset: any, whence: any): void;
    putByte(byte: any): void;
    getByte(): void;
    tell(): void;
    tello(): void;
    eof(): void;
    flush(): void;
    /**
     *
     * @param fourBytesArray - an array-like object that contains 4 elements of number, each number is range from 0 to 255
     * @param position4 - where will the fourBytes be written, default append to the end of byteblock
     */
    mod4(position4: number, fourBytesArray: [number, number, number, number]): void;
    read4(position4: number): number[];
}
interface Position4Range {
    range: [number, number];
    startOffset: number;
    endOffset: number;
    length: number;
}
export {};
