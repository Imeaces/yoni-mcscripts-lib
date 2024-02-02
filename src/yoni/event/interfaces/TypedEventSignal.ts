export default interface TypedEventSignal<E extends {}> {
    
    /**
     * 为事件添加指定的回调函数，并传入可选的过滤器
     * @param callback - 回调函数
     * @returns 传入的回调函数。
     */
    subscribe(
        callback: (arg: E) => void,
        option?: any
    ): (arg: E) => void;
    
    /**
     * 从订阅中移除指定的回调函数
     * @param callback - 指定的回调函数
     */
    unsubscribe(callback: (arg: E) => void): void;
}
