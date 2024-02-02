//@ts-nocheck
import EventListeningAdapter from "../interfaces/EventListeningAdapter";
import TypedEventSignal from "../interfaces/TypedEventSignal";

/**
 * 在事件首次增加/最后移除处理器的时候触发回调，以允许对循环判断触发的事件进行优化。
 */
export class ConditionedEventTargetOptimizer<TEvent extends Function, E extends {} = TEvent["prototype"]> implements EventListeningAdapter<TEvent> {
    /**
     * @param onlisten 当事件增加了第一个处理器的时候调用的回调。
     * @param oncleanlisten 当事件移除了所有处理器的时候调用的回调。
     */
    constructor(onlisten: () => void, oncleanlisten: () => void){
        this.listen = onlisten;
        this.remove = oncleanlisten;
    }
    listen(cb: (event: E) => void){
    }
    remove(): boolean {
        return true;
    }
}