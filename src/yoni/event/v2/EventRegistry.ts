export class EventRegistries {
    static registerEvent(eventClass: Function, noExtends?: boolean){
    }
    static registerBaseEvent(eventClass: Function){
    }
    static unregisterEvent(eventClass: Function){
    }
    static #events: Set<Function>;
    static #eventHandlers = new WeakMap<Function, Set<HandlerList>>();
}

interface HandlerList {
    getEventHandlers(): EventHandler[]
}

interface EventHandler {
    priority: EventPriority
    ignoreCancelled: boolean
    call: Function
}