export default Trigger;
export class Trigger {
    constructor(identifier: any, signal?: null);
    get identifier(): string;
    get namespace(): string | null;
    get eventName(): string;
    signal: any;
    /**
     * 同步的事件回调
     * @param {Function[]} callbacks
     * @param {*} eventClass
     * @param {any[]} eventValues
     */
    firebug(callbacks: Function[], eventClass: any, eventValues: any[]): void;
    /**
     * 异步的事件回调
     * @param {AsyncFunction[]} callbacks
     * @param {*} eventClass
     * @param {any[]} eventValues
     */
    firebugAsync(callbacks: AsyncFunction[], eventClass: any, eventValues: any[]): Promise<PromiseSettledResult<any>[]>;
    getCallbacks(): never[];
    /**
     * @param {any[]} eventValues
     * @param {any[]} filters
     * @return {boolean}
     */
    filterResolver(eventValues: any[], filters: any[]): boolean;
    getCallbacksByFilter(...args: any[]): any[];
    fireEvent(...args: any[]): void;
    fireEventAsync(...args: any[]): Promise<PromiseSettledResult<any>[]>;
    set triggerEvent(arg: (...args: any[]) => void);
    get triggerEvent(): (...args: any[]) => void;
    set triggerEventAsync(arg: (...args: any[]) => Promise<PromiseSettledResult<any>[]>);
    get triggerEventAsync(): (...args: any[]) => Promise<PromiseSettledResult<any>[]>;
    registerEvent(): Trigger;
    unregisterEvent(): Trigger;
    onSubscribe(): void;
    onUnsubscribe(): void;
    whenFirstSubscribe(): void;
    whenLastUnsubscribe(): void;
    #private;
}
export { Trigger as EventTrigger };
