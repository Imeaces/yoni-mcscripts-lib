export declare class BlockByteDateView {
    #private;
    get length(): number;
    constructor(block: Array<number>);
    static getPositionBetweensPosition4Range(position: number, length: number, totalLength: number): Position4Range;
    readBlockAsync(position: number, length: number, blockLength?: number): AsyncGenerator<number[]>;
    readAsync(position: number, length: number): AsyncGenerator<number>;
    read(position: number, length: number): number[];
    write(buffer: number[], position: number, length?: number): void;
    trim(position: number, length: number): void;
    trim4(position4: number): void;
    seek(offset: number, whence: any): void;
    putByte(byte: number): void;
    getByte(): void;
    tell(): void;
    tello(): void;
    eof(): void;
    flush(): void;
    close(): void;
    /**
     *
     * @param fourBytesArray - an array-like object that contains 4 elements of number, each number is range from 0 to 255
     * @param position4 - where will the fourBytes be written, default append to the end of byteblock
     */
    mod4(position4: number, fourBytesArray: [number, number, number, number]): void;
    read4(position4: number): [number, number, number, number];
}
interface Position4Range {
    range: [number, number];
    startOffset: number;
    endOffset: number;
    length: number;
}
export {};
