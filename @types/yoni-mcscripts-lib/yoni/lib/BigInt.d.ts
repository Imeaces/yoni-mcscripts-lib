export class MyBigInt {
    static numberStrs: readonly string[];
    /**
     * 转化数字为一个数组
     */
    static _getRawNumber(theNumber: any, base?: number, numbers?: readonly string[]): (string | number)[];
    /**
     * @returns {string}
     */
    static _getNumberOfRawNumber(rawNumber: any, base?: number, numbers?: readonly string[]): string;
    static _splitRawNumber(rawNumber: any, divisor: any, base?: number): {
        Quotient: number[];
        Remainder: number;
    };
    /**
     * @param {number|string} num - 数字
     * @param {number} base - 数字的新基底
     * @param {number} oldBase - 数字的旧基底
     * @param {string[]} numbers - 用于表示数字的一个字符串序列
     */
    static _coverBase(fromNumber: any, toNewBase: any, byOldBase?: number, besideNumbers?: readonly string[]): string;
    static add(a: any, b: any): void;
    static subtract(): void;
    static multiply(): void;
    static split(): void;
    static equals(a: any, b: any): void;
    constructor(num: any);
    get raw(): (string | number)[];
    valueOf(): (string | number)[];
    toString(): string;
    #private;
}
export { MyBigInt as BigInt };
