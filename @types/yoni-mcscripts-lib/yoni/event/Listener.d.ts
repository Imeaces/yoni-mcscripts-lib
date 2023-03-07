import { IEventSignal } from "./IEventSignal.js";
/**
 * 事件监听管理
 * 不建议移除事件，由于移除事件的机制为设空回调，导致移除事件并不是真正的移除，大量移除事件导致事件遗留，可能影响性能
 * 可能会在以后优化
 */
declare class Listener {
    #private;
    static _getCallback(id: any): undefined;
    /**
     * add a new callback function for specific event
     * @param eventType - the event identify
     * @param callback - callback function
     * @param eventFilters - any arguments you want, they will be transmitted directly
     * @returns {number} - id of the callback
     */
    static register(eventType: string | IEventSignal, callback: (...args: any[]) => void, ...eventFilters: any[]): number;
    /**
     * unregister event listener
     * @param {number} id - eventId
     */
    static unregister(id: number): void;
}
export default Listener;
export { Listener, Listener as EventListener };
