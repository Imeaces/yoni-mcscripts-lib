import { MinecraftSystem } from "./basis.js";
import { Logger } from "./util/Logger.js";
import { isDebugMode } from "./debug.js";
import { config } from "./config.js";

const logger = new Logger("Schedule");
const scheduleCallbacks = new WeakMap();

export enum ScheduleType {
    /**
     * 以真实时间为间隔重复运行的任务。
     */
    timeCycleSchedule = "Schedule.timeCycleSchedule",
    /**
     * 以真实时间为延迟运行的任务。
     */
    timeDelaySchedule = "Schedule.timeDelaySchedule",
    /**
     * 以游戏刻为间隔重复运行的任务。
     */
    tickCycleSchedule = "Schedule.tickCycleSchedule",
    /**
     * 以游戏刻为延迟运行的任务。
     */
    tickDelaySchedule = "Schedule.tickDelaySchedule",
}

function isCycleScheduleType(type: ScheduleType): boolean {
    return type === Schedule.tickCycleSchedule
    || type === Schedule.timeCycleSchedule;
}

export interface ScheduleOptions {
    /**
     * 任务类型。
     */
    "type": ScheduleType
    /**
     * 任务是否为异步任务。（见 {@link Schedule#async}）
     * 默认值为 `false`。
     */
    "async"?: boolean
    /**
     * 任务放入队列后多长时间才开始执行。默认值为 `1`。
     */
    delay: number
    /**
     * 对于重复任务，任务再次运行需要间隔的时间。默认值为 `1`。
     */
    period?: number
}

/**
 * 任务类
 */
export class Schedule {
    /**
     * 以真实时间为间隔重复运行的任务。
     */
    static timeCycleSchedule = ScheduleType.timeCycleSchedule;
    /**
     * 以真实时间为延迟运行的任务。
     */
    static timeDelaySchedule = ScheduleType.timeDelaySchedule;
    /**
     * 以游戏刻为间隔重复运行的任务。
     */
    static tickCycleSchedule = ScheduleType.tickCycleSchedule;
    /**
     * 以游戏刻为延迟运行的任务。
     */
    static tickDelaySchedule = ScheduleType.tickDelaySchedule;
    
    static #scheduleCurrentIndex = 0;
    
    /**
     * 任务的内部ID。
     */
    readonly id: number;
    /**
     * 任务类型。
     */
    readonly "type": ScheduleType;
    /**
     * 是否为异步任务。
     * 对于异步任务，如果任务回调返回了 Promise 对象，
     * 在其状态从 pending 离开时才视为执行结束。
     */
    readonly "async": boolean;
    /**
     * 任务将以此值指定的间隔重复运行。
     * 此值在非重复运行的任务当中没有意义。
     */
    readonly period: number;
    /**
     * 任务将在放入队列多长时间后运行。
     */
    readonly delay: number;
    /**
     * 任务是否已经添加到执行队列。
     */
    isQueue(): boolean {
        return scheduleQueue.has(this);
    }
    get startInQueueTime(): number {
        return scheduleStartInQueueTime.get(this) ?? -1;
    }
    /**
     * 任务是否正在执行。
     * @returns 在同步任务的回调当中会返回 `true`，
     * 异步任务中，任务回调返回的 Promise 处于 pending 状态时返回 `true`。
     * 其余情况返回 `false`。
     */
    isRunning(): boolean {
        if (this.async)
            return runningAsyncSchedule.has(this);
        return executingSchedule === this;
    }
    /**
     * 最后一次执行此任务时是否正常退出。
     * @returns 此任务曾被执行，且最后一次执行时任务回调正常退出的情况下返回 `true`，
     * 其余情况返回 `false`。
     */
    get isSuccessInLastExecute(): boolean {
        return isSuccessInLastExecute(this);
    }
    /**
     * 此任务最后一次执行成功的时间。
     * @returns 此任务曾被执行，且最后一次执行时任务回调正常退出的情况下返回毫秒级别的 unix 时间戳，
     * 其余情况返回 `-1`。
     */
    get lastSuccessTime() {
        return getLastSuccess(this) ?? -1;
    }
    /**
     * 此任务最后一次执行失败的时间。
     * @returns 此任务曾被执行，且最后一次执行时任务回调抛出了错误的情况下返回毫秒级别的 unix 时间戳，
     * 其余情况返回 `-1`。
     */
    get lastFailTime() {
        return getLastFail(this) ?? -1;
    }
    /**
     * 此任务最后一次执行结束的时间。
     * @returns 如果此任务曾被执行，返回毫秒级别的 unix 时间戳，
     * 其余情况返回 `-1`。
     */
    get lastExecuteTime() {
        return getLastExecute(this) ?? -1;
    }
    constructor(props: ScheduleOptions, callback: Function){
        let { async, period, delay, type } = props;
        
        this.async = (!!async) ? true : false;
        
        if (isCycleScheduleType(type)
        && !isFinite(period as number))
            throw new TypeError(`period ${period} not finite`);
        
        this.period = period ?? 0;
        
        if (!isFinite(delay))
            throw new TypeError(`delay ${delay} not finite`);
        
        this.delay = delay ?? 1;
        
        this.type = type;
        
        this.id = Schedule.#scheduleCurrentIndex++;
        
        scheduleCallbacks.set(this, callback);
        
        Object.freeze(this);
    }
    run(){
        const fn = scheduleCallbacks.get(this) as Function;
        fn();
    }
    async runAsync(){
        const fn = scheduleCallbacks.get(this) as Function;
        await fn();
    }
}

const lastTimeExecute = new WeakMap();
const lastTimeExecuteSuccess = new WeakMap();
const lastTimeExecuteFail = new WeakMap();

/**
 * @param {Schedule} schedule - 任务
 * @returns {number|undefined} 时间
 */
function getLastExecute(schedule: Schedule){
    return lastTimeExecute.get(schedule);
}
/**
 * @param {Schedule} schedule - 任务
 * @returns {number|undefined} 时间
 */
function getLastSuccess(schedule: Schedule){
    return lastTimeExecuteSuccess.get(schedule);
}
/**
 * @param {Schedule} schedule - 任务
 * @returns {number|undefined} 时间
 */
function getLastFail(schedule: Schedule){
    return lastTimeExecuteFail.get(schedule);
}
/**
 * @param {Schedule} schedule - 任务
 * @param {number} time - 当前时间
 */
function lastExecute(schedule: Schedule, time: number){
    lastTimeExecute.set(schedule, time);
}
/**
 * @param {Schedule} schedule - 任务
 * @param {number} time - 当前时间
 */
function lastSuccess(schedule: Schedule, time: number){
    lastExecute(schedule, time);
    lastTimeExecuteSuccess.set(schedule, time);
}
/**
 * @param {Schedule} schedule - 任务
 * @param {number} time - 当前时间
 */
function lastFail(schedule: Schedule, time: number){
    lastExecute(schedule, time);
    lastTimeExecuteFail.set(schedule, time);
}
/**
 * @param {Schedule} schedule - 任务
 * @returns {boolean}
 */
function isSuccessInLastExecute(schedule: Schedule){
    const lastExecuteTime = getLastExecute(schedule);
    if (lastExecuteTime === undefined)
        return false;
    else
        return lastExecuteTime === getLastSuccess(schedule);
}

const runningAsyncSchedule: WeakSet<Schedule> = new WeakSet();
let executingSchedule: Schedule | null = null;

/**
 * @param schedule 任务
 */
function executeSchedule(schedule: Schedule){
    if (executingSchedule !== null){
        logger.warn("上一个任务没有正常结束，id: {}", executingSchedule.id);
        executingSchedule = null;
    }
    if (schedule.async) {
        function onSuccess(result: any){
            lastSuccess(schedule, Date.now());
            runningAsyncSchedule.delete(schedule);
        }
        function onFail(error: any){
            lastFail(schedule, Date.now());
            runningAsyncSchedule.delete(schedule);
            logger.error("async schedule {} 运行时出现错误 {}", schedule.id, error);
        }
        runningAsyncSchedule.add(schedule);
        schedule.runAsync().then(onSuccess, onFail);
    } else {
        executingSchedule = schedule;
        
        //这样即使在出现无法捕获的错误的时候也可以标记任务执行失败。
        lastFail(schedule, Date.now());
        
        try {
            //do task
            schedule.run();
            
            lastSuccess(schedule, Date.now());
        } catch (err) {
            lastFail(schedule, Date.now());
            
            logger.error(`schedule {} 运行时出现错误 {}`, schedule.id, err);
        }
        
        executingSchedule = null;
    }
}

function shouldExecuteOneTimeDelaySchedule(schedule: Schedule, curTick: number): boolean {
    return scheduleAddToQueueGameTick.get(schedule) !== curTick;
}

const scheduleExecuteTimer = new WeakMap<Schedule, number>();
const scheduleAddToQueueTime = new WeakMap<Schedule, number>();
const scheduleStartInQueueTime = new WeakMap<Schedule, number>();
/** 仅用于 {@link shouldExecuteOneTimeDelaySchedule} */
const scheduleAddToQueueGameTick = new WeakMap<Schedule, number>();
const queueSchedulesTypedRecord: Record<string, Schedule[]> = {};
/** 仅用于 {@link Schedule#isQueue} */
const scheduleQueue = new WeakSet<Schedule>();

function removeScheduleFromQueue(schedule: Schedule): boolean {
    let queue = queueSchedulesTypedRecord[schedule.type as unknown as string];
    if (queue === undefined){
        return false;
    }
    const location = queue.indexOf(schedule);
    if (location === -1){
        return false;
    }
    queue.splice(location, 1);
    scheduleStartInQueueTime.delete(schedule);
    scheduleAddToQueueTime.delete(schedule);
    scheduleExecuteTimer.delete(schedule);
    scheduleQueue.delete(schedule);
    scheduleAddToQueueGameTick.delete(schedule);
    return true;
}
function addScheduleToQueue(schedule: Schedule): boolean {
    let queue = queueSchedulesTypedRecord[schedule.type as unknown as string];
    if (queue === undefined){
        queue = [];
        queueSchedulesTypedRecord[schedule.type as unknown as string] = queue;
    }
    if (queue.includes(schedule)){
        return false;
    } else {
        queue.push(schedule);
        scheduleStartInQueueTime.set(schedule, Date.now());
        scheduleAddToQueueTime.set(schedule, Date.now());
        scheduleExecuteTimer.set(schedule, schedule.delay);
        scheduleQueue.add(schedule);
        scheduleAddToQueueGameTick.set(schedule, MinecraftSystem.currentTick);
        return true;
    }
}

MinecraftSystem.runInterval(executeTasks, 1);

const taskList: Schedule[] = [];
let legacyTasks: Schedule[] = [];
function executeTasks(){
    if (taskList.length > 0){
        legacyTasks = taskList.concat(legacyTasks);
        taskList.length = 0;
    }
    
    if (config.getInt("scheduler.maxLegacyTaskCount", 0) < legacyTasks.length){
        logger.warn("遗留任务过多，已跳过 {} 个遗留任务", legacyTasks.length);
        legacyTasks.length = 0;
    }
    
    for (let i = legacyTasks.length; i > 0; i--){
        executeSchedule(legacyTasks.pop() as Schedule);
    }
    
    addTimeCycleScheduleToTasks(taskList);
    addTickCycleScheduleToTasks(taskList);
    addTimeDelayScheduleToTasks(taskList);
    addTickDelayScheduleToTasks(taskList);
    
    for (let i = taskList.length; i > 0; i--){
        executeSchedule(taskList.pop() as Schedule);
    }
}

//处理只执行一次的tick任务 tickdelay
function addTickDelayScheduleToTasks(tasks: Schedule[]){
    let schedules = queueSchedulesTypedRecord[Schedule.tickDelaySchedule as unknown as string];
    if (schedules === undefined)
        return;
    
    const curTick = MinecraftSystem.currentTick;

    for (let idx = schedules.length - 1; idx >= 0; idx -= 1){
        const schedule = schedules[idx];
        let lessTime = scheduleExecuteTimer.get(schedule) as number;
        if (lessTime === 1 && !shouldExecuteOneTimeDelaySchedule(schedule, curTick)){
            continue;
        }
        
        if (--lessTime <= 0){
            tasks.push(schedule);
            removeScheduleFromQueue(schedule);
        } else {
            scheduleExecuteTimer.set(schedule, lessTime);
        }
    }
}

//处理只执行一次的time任务 timedelay
function addTimeDelayScheduleToTasks(tasks: Schedule[]){
    let schedules = queueSchedulesTypedRecord[Schedule.timeDelaySchedule as unknown as string];
    if (schedules === undefined)
        return;
    
    for (let idx = schedules.length - 1; idx >= 0; idx -= 1){
        const schedule = schedules[idx];
        const time = Date.now();
        const lastInQueueTime = scheduleAddToQueueTime.get(schedule) as number;
        const passedTime = time - lastInQueueTime;
        let interval = scheduleExecuteTimer.get(schedule) as number;
        let lessTime = interval - passedTime;
        if (--lessTime <= 0){
            tasks.push(schedule);
            removeScheduleFromQueue(schedule);
        }
    }
}

//处理重复执行的tick任务 tickcycle
function addTickCycleScheduleToTasks(tasks: Schedule[]){
    let schedules = queueSchedulesTypedRecord[Schedule.tickCycleSchedule as unknown as string];
    if (schedules === undefined)
        return;

    const curTick = MinecraftSystem.currentTick;
    
    for (let idx = schedules.length - 1; idx >= 0; idx -= 1){
        const schedule = schedules[idx];
        
        //一般情况下，异步任务才会出现这种情况
        if (schedule.isRunning()){
            continue;
        }
        
        let lessTime = scheduleExecuteTimer.get(schedule) as number;
        if (lessTime === 1 && !shouldExecuteOneTimeDelaySchedule(schedule, curTick)){
            continue;
        }
        
        if (--lessTime <= 0){
            tasks.push(schedule);
            scheduleExecuteTimer.set(schedule, schedule.period);
        } else {
            scheduleExecuteTimer.set(schedule, lessTime);
        }
    }
}

//处理重复执行的time任务 timecycle
function addTimeCycleScheduleToTasks(tasks: Schedule[]){
    let schedules = queueSchedulesTypedRecord[Schedule.timeDelaySchedule as unknown as string];
    if (schedules === undefined)
        return;
    
    for (let idx = schedules.length - 1; idx >= 0; idx -= 1){
        const schedule = schedules[idx];
        
        //一般情况下，异步任务才会出现这种情况
        if (schedule.isRunning()){
            continue;
        }
        
        //计算lessTime，即此任务距离下次执行还有多久
        //负数代表任务应该即刻执行
        //这里考虑到任务执行结束的时间可能比较长（特别是异步任务），所以它也作为一个变量参与到运算
        const time = Date.now();
        const lastInQueueTime = scheduleAddToQueueTime.get(schedule) as number;
        const lastScheduleChangeTime = Math.max(getLastExecute(schedule), lastInQueueTime);
        const passedTime = time - lastScheduleChangeTime;
        const interval = scheduleExecuteTimer.get(schedule) as number;
        let lessTime = interval - passedTime;
        
        if (--lessTime <= 0){
            tasks.push(schedule);
            scheduleAddToQueueTime.set(schedule, time);
        }
    }
}


/**
 * 你可以使用它创建任务
 */
export class YoniScheduler {
    /**
     * @param schedule 要添加到队列的任务。
     * @returns 操作是否成功。
     */
    static addSchedule(schedule: Schedule): boolean {
        if (!(schedule instanceof Schedule))
            throw new TypeError("Not a Schedule");
        
        if (addScheduleToQueue(schedule)){
            logger.trace("增加了新的任务, id: {}, async: {}, type: {}, period: {}, delay: {}", schedule.id, schedule["async"], schedule.type.toString(), schedule.period, schedule.delay);
            return true;
        }
        return false;
    }
    /**
     * @param schedule 要从队列中移除的任务。
     * @returns 操作是否成功。
     */
    static removeSchedule(schedule: Schedule | number){
        if (typeof schedule === "number"){
            OuterForCycle:
            for (const ischedules of Object.values(queueSchedulesTypedRecord)){
                for (const ischedule of ischedules){
                    if (ischedule.id === schedule){
                        schedule = ischedule;
                        break OuterForCycle;
                    }
                }
            }
        }
        if (!(schedule instanceof Schedule))
            throw new TypeError("Not a Schedule");
        
        if (removeScheduleFromQueue(schedule)){
        
            logger.trace("移除了任务, id: {}", schedule.id);
            return true;
        }
        
        return false;
    }
    /**
     * 创建任务并使其运行指定的回调函数。
     * @param callback 需要执行的函数。
     * @param async 是否异步执行。
     * @returns scheduleId
     */
    static runTask(callback: Function, async: boolean = false): number {
        let schedule = new Schedule({
            async,
            delay: 0,
            type: Schedule.tickDelaySchedule
        }, callback);
        YoniScheduler.addSchedule(schedule);
        return schedule.id;
    }
    /**
     * 在 `delay` 毫秒之后调用一个函数。
     * @param callback 需要执行的函数。
     * @param delay 延迟的毫秒数。
     * @param async 是否异步执行。
     * @returns scheduleId
     */
    static runDelayTimerTask(callback: Function, delay: number, async = false): number {
        let schedule = new Schedule({
            async, delay,
            type: Schedule.timeDelaySchedule
        }, callback);
        YoniScheduler.addSchedule(schedule);
        return schedule.id;
    }
    /**
     * 在 `delay` 个游戏刻之后调用一个函数。
     * @param callback 需要执行的函数。
     * @param delay 延迟的游戏刻。
     * @param async 是否异步执行。
     * @returns scheduleId
     */
    static runDelayTickTask(callback: Function, delay: number, async: boolean = false) {
        let schedule = new Schedule({
            async,
            delay,
            type: Schedule.tickDelaySchedule
        }, callback);
        YoniScheduler.addSchedule(schedule);
        return schedule.id;
    }
    /**
     * 在 `delay` 毫秒之后，开始以 `period` 毫秒的间隔重复调用一个函数。
     * @param callback 需要执行的函数。
     * @param delay 延迟的毫秒树。
     * @param period 每次调用间隔的毫秒数。
     * @param async 是否异步执行。
     * @returns scheduleId
     */
    static runCycleTimerTask(callback: Function, delay: number, period: number, async: boolean = false): number {
        let schedule = new Schedule({
            async,
            delay,
            period,
            type: Schedule.timeCycleSchedule
        }, callback);
        YoniScheduler.addSchedule(schedule);
        return schedule.id;
    }
    /**
     * 在 `delay` 个游戏刻之后，开始以 `period` 个游戏刻的间隔重复调用一个函数。
     * 需要注意的是，间隔时间只在每游戏刻计算一次，小于游戏刻间隔的时间没有意义。
     * @param callback 需要执行的函数。
     * @param delay 延迟的游戏刻。
     * @param period 每次调用间隔的游戏刻。
     * @param async 是否异步执行。
     * @returns scheduleId
     */
    static runCycleTickTask(callback: Function, delay: number, period: number, async: boolean = false): number {
        let schedule = new Schedule({
            async,
            delay,
            period,
            type: Schedule.tickCycleSchedule
        }, callback);
        YoniScheduler.addSchedule(schedule);
        return schedule.id;
    }
}

//对于异常挂断的特殊处理，但是没见他触发过一次
MinecraftSystem.beforeEvents.watchdogTerminate.subscribe((event) => {
    if (executingSchedule !== null) {
        logger.warn("在执行一个任务的过程中碰到了脚本挂断事件，事件id: {}, 类型: {}, 挂断原因: {}", executingSchedule.id, String(executingSchedule.type), event.terminateReason);
        if (isDebugMode()) {
            logger.warn("正在输出相关任务的回调代码，请在trace中查看");
            logger.trace(String(scheduleCallbacks.get(executingSchedule)));
        }
    }
});
