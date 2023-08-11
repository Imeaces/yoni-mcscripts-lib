import { EventPriority } from "../EventPriority.js";
import { manager } from "../EventManager.js";
import { EventListenerData, sEventListenerData } from "../decorators/EventListener.js";
import IEventHandler from "../interfaces/EventHandler";
import IEventListener from "../interfaces/EventListener";

/*
function listenEvent<TEvent extends Function>(
    event: TEvent,
    ignoreCancelled: boolean
): ;
function listenEvent<TEvent extends Function>(
    event: TEvent,
    options?: Exclude<any, EventCallback<TEvent>>,
    ignoreCancelled?: boolean
);
*/

//@ts-ignore
function listenEvent<TEvent extends Function>(
    event: TEvent,
    callback: EventCallback<TEvent>,
    options?: any,
    ignoreCancelled?: boolean
): EventListener
//@ts-ignore
function listenEvent<TEvent extends Function>(
    event: TEvent,
    callback: EventCallback<TEvent>, 
    ignoreCancelled: boolean
): EventListener
//@ts-ignore
function listenEvent<TEvent extends Function>(
    event: TEvent,
    callback: EventCallback<TEvent>,
    options?: any,
    ignoreCancelled?: boolean
){
    /*if (typeof callback !== "function"){
        return Reflect.apply(listenEventDecorator, null, arguments);
    }*/
    
    if (arguments.length === 3){
        ignoreCancelled = options as unknown as boolean;
        options = undefined;
    }
    
    let listenerOption = { options, ignoreCancelled, priority: EventPriority.NORMAL };
    
    let listener = new SingleHandlerEventListener(event, callback, listenerOption);
    
    manager.addListener(listener);
    
    return listener;
}

export interface CallListenEventOptions {
    priority: EventPriority,
    options?: any
    ignoreCancelled?: boolean
}

class SingleHandlerEventListener<TEvent extends Function> implements IEventListener<SingleHandlerEventListener<TEvent>> {
    constructor(event: TEvent, cb: EventCallback<TEvent>, options?: CallListenEventOptions){
        this[sEventListenerData].handlerEntries[0] = [
            event,
            options?.priority ?? EventPriority.NORMAL,
            {
                options: options?.options,
                onEvent: cb,
                ignoreCancelled: options?.ignoreCancelled ?? true
            }
        ];
    }
    [sEventListenerData] = new EventListenerData<SingleHandlerEventListener<TEvent>>();
}

export function listenAsyncEvent<TFunction extends Function>(event: TFunction, callback: (arg: TFunction["prototype"]) => Promise<void>){
}

type EventCallback<TEvent extends Function, E extends {} = TEvent["prototype"]> = (event: E) => void
