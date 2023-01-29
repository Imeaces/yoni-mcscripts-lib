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
     * @param {EventIdentity} caller - the event identify
     * @param {Function} callback - callback function
     * @params args - any arguments you want, they will be transmitted directly
     * @return {number} - id of the callback
     */
    static register(eventType: any, callback: any, ...eventFilters: any[]): number;
    static unregister(id: any): void;
}
export default Listener;
export { Listener, Listener as EventListener };
