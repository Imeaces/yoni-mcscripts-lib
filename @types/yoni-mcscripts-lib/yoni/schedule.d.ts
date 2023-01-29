export declare class Schedule {
    static timeCycleSchedule: string;
    static timeDelaySchedule: string;
    static tickCycleSchedule: string;
    static tickDelaySchedule: string;
    id: any;
    isQueue(): boolean;
    isRunning(): boolean;
    get isLastSuccess(): boolean;
    get lastSuccessTime(): null;
    /**
     * 获取此任务最后一次执行时抛出错误的时间。
     * 对于同步任务，无法获取由于Minecraft挂断执行导致的错误，这种错误无法被捕获，故无法记录。
     */
    get lastFailTime(): null;
    get lastExecuteTime(): null;
    /**
     *
     * @param {{async?: boolean, type: any, period?:number, delay?:number}} props
     * @param {() => void} callback
     */
    constructor(props: any, callback: any);
    run(...args: any[]): void;
    runAsync(...args: any[]): Promise<void>;
}
/**
 * 你可以使用它创建任务
 */
export default class YoniScheduler {
    static addSchedule(schedule: any): any;
    /**
     * @param {Number|Schedule} taskId
     */
    static removeSchedule(idOrSchedule: any): boolean;
    /**
     * 执行一个任务（以尽量快的速度）
     * @param {Function} 需要执行的任务
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runTask(callback: any, async?: boolean): any;
    /**
     * 在delay毫秒之后，执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少毫秒后开始执行
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runDelayTimerTask(callback: any, delay: any, async?: boolean): any;
    /**
     * 在delay刻之后，执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少刻后开始执行
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runDelayTickTask(callback: any, delay: any, async?: boolean): any;
    /**
     * 在delay毫秒之后，以固定period执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少毫秒后开始执行
     * @param {Number} 每隔多少毫秒触发一次
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runCycleTimerTask(callback: any, delay: any, period: any, async?: boolean): any;
    /**
     * 在delay刻之后，以固定period执行一个任务
     * @param {Function} 需要执行的任务
     * @param {Number} 延时多少刻后开始执行
     * @param {Number} 每隔多少刻触发一次
     * @param {Boolean} 是否异步执行
     * @returns {Number} taskId
     */
    static runCycleTickTask(callback: any, delay: any, period: any, async?: boolean): any;
}
export { YoniScheduler };
