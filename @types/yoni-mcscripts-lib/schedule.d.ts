export class Schedule {
    static timeCycleSchedule: symbol;
    static timeDelaySchedule: symbol;
    static tickCycleSchedule: symbol;
    static tickDelaySchedule: symbol;
    constructor(props: any, callback: any);
    id: number;
    get isQueue(): boolean;
    get isLastSuccess(): boolean;
    get lastSuccessTime(): any;
    get lastFailTime(): any;
    get lastExecuteTime(): any;
    async: boolean;
    period: any;
    delay: any;
    type: any;
    run(...args: any[]): void;
    runAsync(...args: any[]): Promise<void>;
}
/**
 * 你可以使用它创建任务
 */
export default class YoniScheduler {
    static addSchedule(schedule: any): number;
    /**
     * @param {Number|Schedule} taskId
     */
    static removeSchedlue(idOrSchedule: any): boolean;
    /**
     * 执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runTask(callback: any, async?: boolean): number;
    /**
     * 在delay毫秒之后，执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少毫秒后开始执行
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runDelayTimerTask(callback: any, delay?: number, async?: boolean): number;
    /**
     * 在delay刻之后，执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少刻后开始执行
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runDelayTickTask(callback: any, delay?: number, async?: boolean): number;
    /**
     * 在delay毫秒之后，以固定period执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少毫秒后开始执行
     * @param {Number} 每隔多少毫秒触发一次
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runCycleTimerTask(callback: any, delay: any, period?: number, async?: any): number;
    /**
     * 在delay刻之后，以固定period执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少刻后开始执行
     * @param {Number} 每隔多少刻触发一次
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runCycleTickTask(callback: any, delay: number | undefined, period: any, async?: boolean): number;
}
