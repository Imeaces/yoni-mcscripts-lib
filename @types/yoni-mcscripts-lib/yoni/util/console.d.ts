export function printError(...args: any[]): void;
/** 我也不知道它怎么运行的，反正你传参就对了
传重复参数可能会出现一些问题，忍着 */
export function visualizeValue(value: any, maxDepth?: number, applyOption?: {}, option?: {
    depth: number;
    circularRecord: Map<any, any>;
    showEnumerableOnly: boolean;
    objectChain: never[];
    maxItemPerObject: number;
    recursiveQuery: boolean;
}): string;
/**
 * @param {any} msg
 * @param {any} err
 */
export function getErrorMsg(msg?: any, err?: any): {
    msg: any;
    errMsg: string;
};
export namespace formatStr {
    const black: string;
    const dark_blue: string;
    const dark_green: string;
    const dark_aqua: string;
    const dark_red: string;
    const dark_purple: string;
    const gold: string;
    const gray: string;
    const dark_gray: string;
    const blue: string;
    const green: string;
    const aqua: string;
    const red: string;
    const light_purple: string;
    const yellow: string;
    const white: string;
    const minecoin_gold: string;
    const obfuscated: string;
    const bold: string;
    const italic: string;
    const reset: string;
    const unknownVal: string;
}
