export default Listener;
/**
 * 事件监听管理
 * 不建议移除事件，由于移除事件的机制为设空回调，导致移除事件并不是真正的移除，大量移除事件导致事件遗留，可能影响性能
 * 可能会在以后优化
 */
export class Listener {
    static "__#3@#callbacks": any[];
    static "__#3@#index": number;
    static _getCallback(id: any): any;
    static "__#3@#fireCallback"(id: any, ...args: any[]): any;
    static "__#3@#delayRegister"(idx: any, eventType: any, callback: any, ...eventFilters: any[]): any;
    static "__#3@#doDelayRegister"(options: any): void;
    static "__#3@#doRegister"(idx: any, eventType: any, callback: any, ...eventFilters: any[]): void;
    /**
     * add a new callback function for specific event
     * @param {EventIdentity} caller - the event identify
     * @param {Function} callback - callback function
     * @params args - any arguments you want, they will be transmitted directly
     * @return {number} - id of the callback
     */
    static register(eventType: any, callback: Function, ...eventFilters: any[]): number;
    static unregister(id: any): void;
}
export { Listener as EventListener };
