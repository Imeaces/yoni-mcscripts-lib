import { EventPriority } from "../EventPriority.js";
import { manager } from "../EventManager.js";
import { EventListenerData, sEventListenerData } from "../decorators/EventListener.js";
import IEventHandler from "../interfaces/EventHandler";
import IEventListener from "../interfaces/EventListener";
import { EventOptionType } from "../GetEventOptions.js";

export interface ListenEventOptions<TEvent extends Function> {
    event: TEvent
    eventOptions?: EventOptionType<TEvent["prototype"]>
    priority?: EventPriority
    ignoreCancelled?: boolean
}

function listenEvent<TEvent extends Function>(
    listenOptions: ListenEventOptions<TEvent>,
    callback: EventCallback<TEvent>
): SingleHandlerEventListener<TEvent>
function listenEvent<TEvent extends Function>(
    event: TEvent,
    callback: EventCallback<TEvent>
): SingleHandlerEventListener<TEvent>
function listenEvent<TEvent extends Function>(listenOptions: ListenEventOptions<TEvent> | TEvent, callback: EventCallback<TEvent>): SingleHandlerEventListener<TEvent> {
    let tevent: TEvent;
    let priority = EventPriority.NORMAL;
    let ignoreCancelled: boolean = false;
    let eventOptions: EventOptionType<TEvent["prototype"]> | undefined = undefined;
    
    if (listenOptions instanceof Function){
        tevent = listenOptions as TEvent;
    } else {
        tevent = listenOptions.event;
        if (listenOptions.priority)
            priority = listenOptions.priority;
        
        if (listenOptions.eventOptions != null)
            eventOptions = listenOptions.eventOptions;
        
        if (listenOptions.ignoreCancelled != null)
            ignoreCancelled = listenOptions.ignoreCancelled;
        
    }
    
    let listenerOptions: CallListenEventOptions<TEvent> = { ignoreCancelled, priority: EventPriority.NORMAL };
    if (eventOptions){
        listenerOptions.options = eventOptions;
    }
    
    let listener = new SingleHandlerEventListener(tevent, callback, listenerOptions);
    
    manager.addListener(listener);
    
    return listener;
}

export interface CallListenEventOptions<TEvent extends Function> {
    priority: EventPriority,
    options?: EventOptionType<TEvent["prototype"]>
    ignoreCancelled?: boolean
}

export class SingleHandlerEventListener<TEvent extends Function> implements IEventListener<SingleHandlerEventListener<TEvent>> {
    constructor(event: TEvent, cb: EventCallback<TEvent>, options?: CallListenEventOptions<TEvent>){
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

export type EventCallback<TEvent extends Function, E extends {} = TEvent["prototype"]> = (event: E) => void

export { listenEvent };

