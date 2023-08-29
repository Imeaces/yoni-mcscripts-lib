import { sEventListenerData, getListenerData } from "./EventListener.js";
import { EventPriority } from "../EventPriority.js";
import IEventListener from "../interfaces/EventListener";
import { EventOptionType } from "../GetEventOptions";

interface EventHandlerOptions<TEvent extends Function> {
    event: TEvent,
    priority?: EventPriority
    ignoreCancelled?: boolean
    options?: EventOptionType<TEvent["prototype"]>,
}

export function EventHandler<
    TEvent extends Function,
    E extends {} = TEvent["prototype"]
>(options: EventHandlerOptions<TEvent>){
    
    function EventHandlerMethodDecorator<
        T extends TypedObjectMethod<K, [E]>,
        K extends string | symbol
    >
    (target: T, propKey: K, desc: PropertyDescriptor): void {
        const onEvent = target[propKey];
        const data = getListenerData(target);
        const listeners = data.registeredListeners;
        
        if (!data)
            throw new TypeError("no EventListener data found, try decorate the class with @EventListener");
        
        const handler = {
            onEvent: function(event: E){
                listeners.forEach(listener => {
                    Reflect.apply(onEvent, listener, [event]);
                });
            },
            ignoreCancelled: options.ignoreCancelled ?? true,
            options: options.options
        }
        
        data.handlerEntries.push([options.event, options.priority ?? EventPriority.NORMAL, handler]);
    }
    
    return EventHandlerMethodDecorator;
}

type TypedObjectMethod<
    K extends string | symbol,
    P extends any[],
    R = any
> = {
    [k in K]: (...args: P) => R
}
