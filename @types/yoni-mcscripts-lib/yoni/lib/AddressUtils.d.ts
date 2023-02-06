export function toIntAddress(address: any, addrnums?: string[]): number;
export function toAddress(int: any, addrnums?: string[]): string;
/**
 * 分割数字
 */
export function getNumArr(num: any, base?: number, numbers?: string[]): (string | number)[];
/**
 * @returns {string}
 */
export function getNum(numArr: any, base?: number, numbers?: string[]): string;
export function splitNumberArr(numArr: any, sp: any, base?: number): {
    Quotient: number[];
    Remainder: number;
};
/**
 * @param {number|string} num - 数字
 * @param {number} base - 数字的新基底
 * @param {number} oldBase - 数字的旧基底
 * @param {string[]} numbers - 用于表示数字的一个字符串序列
 */
export function coverBase(num: number | string, base: number, oldBase?: number, numbers?: string[]): string;
export let addressNumbers: string[];
