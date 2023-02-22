/**
 * 任务是否会异步执行。
 * @name Schedule#async
 * @readonly
 * @type {boolean}
 */
/**
 * 任务类
 */
export class Schedule {
    static timeCycleSchedule: string;
    static timeDelaySchedule: string;
    static tickCycleSchedule: string;
    static tickDelaySchedule: string;
    /**
     *
     * @param {{async?: boolean, type: string, period?: number, delay?: number}} props
     * @param {() => void} callback
     */
    constructor(props: {
        async?: boolean | undefined;
        type: string;
        period?: number | undefined;
        delay?: number | undefined;
    }, callback: () => void);
    /**
     * 任务的内部ID。
     * @readonly
     * @type {number}
     */
    readonly id: number;
    /**
     * 任务将以多大的间隔循环运行。
     * @readonly
     * @type {number}
     */
    readonly period: number;
    /**
     * 任务将在放入队列多长时间后运行。
     * @readonly
     * @type {number}
     */
    readonly delay: number;
    /**
     * 任务是否已经添加到执行队列。
     * @returns {boolean}
     */
    isQueue(): boolean;
    /**
     * 任务是否正在执行。
     * @returns {boolean}
     */
    isRunning(): boolean;
    /**
     * @type {number}
     */
    get isLastSuccess(): number;
    /**
     * 获取此任务最后一次成功运行（没有抛出错误）的时间。
     * @returns {number} 如果没有运行过，将返回 `-1`。
     */
    get lastSuccessTime(): number;
    /**
     * 获取此任务在运行时，最后一次抛出错误的时间。
     * 另外，对于同步任务，无法捕获看门狗挂断导致的错误，故无法记录。
     * @returns {number} 如果没有抛出过错误，将返回 `-1`。
     */
    get lastFailTime(): number;
    /**
     * 获取此任务最后一次运行的时间。
     * @returns {number} 如果没有运行过，将返回 `-1`。
     */
    get lastExecuteTime(): number;
    async: boolean;
    type: string;
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
     * 创建任务并在其中运行回调函数。
     * @param {() => void} callback 需要执行的函数。
     * @param {boolean} async 是否异步执行。
     * @returns {number} taskId
     */
    static runTask(callback: () => void, async?: boolean): number;
    /**
     * 在 `delay` 毫秒之后调用一个函数。
     * @param {() => void} callback - 需要执行的函数。
     * @param {number} delay - 延迟的毫秒数。
     * @param {boolean} async - 是否异步执行。
     * @returns {number} taskId
     */
    static runDelayTimerTask(callback: () => void, delay: number, async?: boolean): number;
    /**
     * 在 `delay` 个游戏刻之后调用一个函数。
     * @param {() => void} callback - 需要执行的函数。
     * @param {number} delay - 延迟的游戏刻。
     * @param {boolean} async - 是否异步执行。
     * @returns {number} taskId
     */
    static runDelayTickTask(callback: () => void, delay: number, async?: boolean): number;
    /**
     * 在 `delay` 毫秒之后，开始以 `period` 毫秒的间隔调用一个函数。
     * @param {() => void} callback - 需要执行的函数。
     * @param {number} delay - 延迟的毫秒树。
     * @param {number} period - 每次调用间隔的毫秒数。
     * @param {boolean} async - 是否异步执行。
     * @returns {number} taskId
     */
    static runCycleTimerTask(callback: () => void, delay: number, period: number, async?: boolean): number;
    /**
     * 在 `delay` 个游戏刻之后，开始以 `period` 个游戏刻的间隔调用一个函数。
     * @param {() => void} callback - 需要执行的函数。
     * @param {number} delay - 延迟的游戏刻。
     * @param {number} period - 每次调用间隔的游戏刻。
     * @param {boolean} async - 是否异步执行。
     * @returns {number} taskId
     */
    static runCycleTickTask(callback: () => void, delay: number, period: number, async?: boolean): number;
}
