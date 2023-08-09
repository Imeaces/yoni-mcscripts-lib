import { EventPriority } from "../EventPriority.js";
import EventHandler from "../interfaces/EventHandler";

export class EventListenerData<T> {
    handlerEntries: [Function, EventPriority, EventHandler<any>][] = [];
    registeredListeners = new Set<T>();
}

export const sEventListenerData: unique symbol = Symbol("EventListenerHandlerEntries");
export function EventListener(){
    return EventListenerClassDecorator;
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