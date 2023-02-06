export class Schedule {
    static timeCycleSchedule: string;
    static timeDelaySchedule: string;
    static tickCycleSchedule: string;
    static tickDelaySchedule: string;
    /**
     *
     * @param {{async?: boolean, type: any, period?:number, delay?:number}} props
     * @param {() => void} callback
     */
    constructor(props: {
        async?: boolean | undefined;
        type: any;
        period?: number | undefined;
        delay?: number | undefined;
    }, callback: () => void);
    id: number;
    isQueue(): boolean;
    isRunning(): boolean;
    get isLastSuccess(): boolean;
    get lastSuccessTime(): any;
    /**
     * 获取此任务最后一次执行时抛出错误的时间。
     * 对于同步任务，无法获取由于Minecraft挂断执行导致的错误，这种错误无法被捕获，故无法记录。
     */
    get lastFailTime(): any;
    get lastExecuteTime(): any;
    async: boolean;
    period: number | undefined;
    delay: number | undefined;
    type: any;
    run(...args: any[]): void;
    runAsync(...args: any[]): Promise<void>;
}
/**
 * 你可以使用它创建任务
 */
export default class YoniScheduler {
    /**
     * @param {Schedule} schedule
     * @returns {number} taskId
     */
    static addSchedule(schedule: Schedule): number;
    /**
     * @param {number|Schedule} schedule
     * @returns {boolean}
     */
    static removeSchedule(schedule: number | Schedule): boolean;
    /**
     * 执行一个任务（以尽量快的速度）
     * @param {() => {}} 需要执行的任务
     * @param {boolean} 是否异步执行
     * @returns {number} taskId
     */
    static runTask(callback: any, async?: boolean): number;
    /**
     * 在delay毫秒之后，执行一个任务
     * @param {() => void} callback - 需要执行的任务
     * @param {number} delay - 延时多少毫秒后开始执行
     * @param {boolean} async - 是否异步执行
     * @returns {number} taskId
     */
    static runDelayTimerTask(callback: () => void, delay: number, async?: boolean): number;
    /**
     * 在delay刻之后，执行一个任务
     * @param {() => void} callback - 需要执行的任务
     * @param {number} period - 每隔多少刻触发一次
     * @param {boolean} async - 是否异步执行
     * @returns {number} taskId
     */
    static runDelayTickTask(callback: () => void, delay: any, async?: boolean): number;
    /**
     * 在delay毫秒之后，以固定period执行一个任务
     * @param {() => void} callback - 需要执行的任务
     * @param {number} delay - 延时多少毫秒后开始执行
     * @param {number} period - 每隔多少毫秒触发一次
     * @param {boolean} async - 是否异步执行
     * @returns {number} taskId
     */
    static runCycleTimerTask(callback: () => void, delay: number, period: number, async?: boolean): number;
    /**
     * 在delay刻之后，以固定period执行一个任务
     * @param {() => void} callback - 需要执行的任务
     * @param {number} delay - 延时多少刻后开始执行
     * @param {number} period - 每隔多少刻触发一次
     * @param {boolean} async - 是否异步执行
     * @returns {number} taskId
     */
    static runCycleTickTask(callback: () => void, delay: number, period: number, async?: boolean): number;
}
