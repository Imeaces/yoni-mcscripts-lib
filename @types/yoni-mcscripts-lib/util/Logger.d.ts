export function log(...args: any[]): void;
export let logLevel: any;
export class Logger {
    static LEVEL_FATAL: number;
    static LEVEL_ERROR: number;
    static LEVEL_WARN: number;
    static LEVEL_INFO: number;
    static LEVEL_DEBUG: number;
    static LEVEL_TRACE: number;
    static log(...args: any[]): void;
    constructor(name: any);
    name: any;
}
export default Logger;
