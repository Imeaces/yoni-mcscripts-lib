export interface IEventSignal {
    /**
     * 为事件添加指定的回调函数，并传入可选的过滤器
     * @param callback - 回调函数
     * @param filters
     * @returns 传入的回调函数
     */
    subscribe(callback: (arg: any) => void, ...filters: any[]): (arg: any) => void;
    /**
     * 从订阅中移除指定的回调函数
     * @param callback - 指定的回调函数
     * @returns
     */
    unsubscribe(callback: (arg: any) => void): (arg: any) => void;
}
