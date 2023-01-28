import { IEventTrigger } from "./IEventTrigger.js";
declare class Trigger implements IEventTrigger {
    #private;
    constructor(identifier: any, signal?: null);
    get identifier(): string;
    get namespace(): null;
    get eventName(): null;
    signal: any;
    getCallbacks: any;
    /**
     * 同步的事件回调
     * @param {Function[]} callbacks
     * @param {*} eventClass
     * @param {any[]} eventValues
     */
    firebug(callbacks: any, eventClass: any, eventValues: any): void;
    /**
     * 异步的事件回调
     * @param {AsyncFunction[]} callbacks
     * @param {*} eventClass
     * @param {any[]} eventValues
     */
    firebugAsync(callbacks: any, eventClass: any, eventValues: any): Promise<PromiseSettledResult<any>[]>;
    /**
     * @param {any[]} eventValues
     * @param {any[]|any} filters
     * @return {boolean}
     */
    filterResolver(eventValues: any, filters: any): boolean;
    getCallbacksByFilter(...args: any[]): any;
    fireEvent(...args: any[]): void;
    fireEventAsync(...args: any[]): Promise<PromiseSettledResult<any>[]>;
    get triggerEvent(): (...args: any[]) => void;
    set triggerEvent(v: (...args: any[]) => void);
    get triggerEventAsync(): (...args: any[]) => Promise<PromiseSettledResult<any>[]>;
    set triggerEventAsync(v: (...args: any[]) => Promise<PromiseSettledResult<any>[]>);
    registerEvent(): this;
    unregisterEvent(): this;
}
export default Trigger;
export { Trigger };
export { Trigger as EventTrigger };
