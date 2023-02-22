export declare let originalConsole: Console;
export declare let logLevel: number;
export declare class Logger {
    static LEVEL_FATAL: number;
    static LEVEL_ERROR: number;
    static LEVEL_WARN: number;
    static LEVEL_INFO: number;
    static LEVEL_DEBUG: number;
    static LEVEL_TRACE: number;
    static log(...args: any[]): void;
    /**
     * 以指定的等级输出日志。
     */
    [n: string]: (...args: any[]) => void;
    constructor(name?: string);
}
export default Logger;
export declare const log: typeof Logger.log;
declare const defaultLogger: Logger;
export { defaultLogger as console };
