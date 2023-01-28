export declare function toIntAddress(address: any): number;
export declare function toAddress(int: any): string;
declare let addressNumbers: string[];
export { addressNumbers };
/**
 * 分割数字
 */
export declare function getNumArr(num: any, base?: number, numbers?: string[]): never[];
/**
 * @returns {string}
 */
export declare function getNum(numArr: any, base?: number, numbers?: string[]): string;
export declare function splitNumberArr(numArr: any, sp: any, base?: number): {
    Quotient: never[];
    Remainder: number;
};
/**
 * @param {number|string} num - 数字
 * @param {number} base - 数字的新基底
 * @param {number} oldBase - 数字的旧基底
 * @param {string[]} numbers - 用于表示数字的一个字符串序列
 */
export declare function coverBase(num: any, base: any, oldBase?: number, numbers?: string[]): string;
