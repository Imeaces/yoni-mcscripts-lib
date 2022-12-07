export function toAddress(int: any): void;
export function toAddress(int: any): string;
export function toIntAddress(address: any): number;
export function getNumArr(num: any, base?: number, numbers?: string[]): number[];
export function getNum(numArr: any, base?: number, numbers?: string[]): string;
export function splitNumberArr(numArr: any, sp: any, base?: number): {
    Quotient: number[];
    Remainder: number;
};
export function coverBase(num: any, base: any, oldBase?: number, numbers?: string[]): string;
