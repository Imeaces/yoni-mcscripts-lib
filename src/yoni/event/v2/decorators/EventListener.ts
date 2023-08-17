import { EventPriority } from "../EventPriority.js";
import { manager as eventManager } from "../EventManager.js";
import EventHandler from "../interfaces/EventHandler";

export class EventListenerData<T> {
    isStaticListener = false;
    handlerEntries: [Function, EventPriority, EventHandler<any>][] = [];
    registeredListeners = new Set<T>();
}

export const sEventListenerData: unique symbol = Symbol("EventListenerHandlerEntries");

interface EventListenerOptions {
    /** 注册静态处理器 */
    static?: boolean
    /** 注册实例处理器 */
    instance?: boolean
}

function EventListener<TFunction extends Function>(target: TFunction): void
function EventListener(options: {
    static?: boolean
    instance?: boolean
}): <TFunction extends Function>(target: TFunction) => void
function EventListener<TFunction extends Function>(arg: TFunction | EventListenerOptions){
    if (arg instanceof Function)
        return EventListenerClassDecorator(arg);
    
    if ((arg.static ?? false) && (arg.instance ?? true))
        return EventListenerClassAndStaticDecorator;
    else if (!(arg.static ?? false) && (arg.instance ?? true))
        return EventListenerClassDecorator;
    else if ((arg.static ?? false) && !(arg.instance ?? true))
        return EventListenerClassStaticDecorator;
    else 
        throw new TypeError("unknown options");
}

function EventListenerClassAndStaticDecorator<TFunction extends Function>(target: TFunction): void {
    EventListenerClassStaticDecorator(target);
    EventListenerClassDecorator(target);
}
 
function EventListenerClassDecorator<TFunction extends Function>(target: TFunction): void {
    const data = new EventListenerData<TFunction["prototype"]>();
    Object.defineProperty(target.prototype, sEventListenerData, {
        configurable: true,
        get(){
            if (!(this instanceof target))
                throw new TypeError("not the target");
            return data;
        }
    });
}

function EventListenerClassStaticDecorator<TFunction extends Function>(target: TFunction): void {
    const data = new EventListenerData<TFunction>();
    Object.defineProperty(target, sEventListenerData, {
        configurable: true,
        writable: false,
        value: data
    });
    data.isStaticListener = true;
}

export { EventListener };

