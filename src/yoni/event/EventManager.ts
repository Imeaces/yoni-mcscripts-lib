import { sEventListenerData } from "./decorators/EventListener.js";
import IEventHandler from "./interfaces/EventHandler";
import IEventListener from "./interfaces/EventListener";
import { logger } from "./logger.js";
import { EventError } from "./EventError.js";
import { EventRegistry } from "./EventRegistry.js";
import { isDebug, config } from "../config.js";
import { listenEvent, EventCallback, ListenEventOptions, SingleHandlerEventListener } from "./lib/listenEvent.js";

export class EventManager {
    /**
     * 处理事件回调要求的额外参数。
     */
    static checkExtraOption<
        T extends EventRegistry<TEvent>,
        TEvent extends Function = T["eventClass"],
        Event extends {} = TEvent["prototype"]
    >(
        eventRegistry: T,
        handler: IEventHandler<TEvent>,
        event: Event
    ): boolean {
    
        if (!eventRegistry.extraOption
        || !handler.options
        || !eventRegistry.extraOptionResolver){
            return true;
        }
    
        try {
            return eventRegistry.extraOptionResolver(event, handler.options);
        } catch(e){
            if (isDebug() || config.getConfig("eventManager.showErrorOfEventFilter"))
                logger.warn("处理事件过滤器时发生以下错误:", e);
        }
        
        return false;
    }
    /**
     * 处理一次事件。
     * @param eventRegistry 事件的注册信息。
     * @param event 事件对象。
     * @param noExtendsAlways 指定是否不应该去尝试扩展事件的回调范围。
     */
    callEvent<
        T extends EventRegistry<TEvent>,
        TEvent extends Function = T["eventClass"],
        E extends {} = TEvent["prototype"]
    >(eventRegistry: T, event: E, noExtendsAlways: boolean = false){
        eventRegistry.throwIfNotRegistered();
        
        if (!noExtendsAlways && !eventRegistry.noExtends){
            let extendsEvents = EventRegistry.getExtends(eventRegistry);
            
            for (const registry of extendsEvents){
                this.callEvent(registry, event as any, true);
            }
        }
        
        try {
            for (const handler of eventRegistry.handlers){
                if (handler.ignoreCancelled
                && "cancel" in event
                && event.cancel){
                    continue; //跳过，由于处理器不接受已取消事件
                }
                
                if (!EventManager.checkExtraOption(eventRegistry, handler, event)){
                    continue;
                }
                
                try { //捕获事件处理错误，并输出日志
                    handler.onEvent(event);
                } catch(e){
                    logger.error("处理事件 {} 时发生以下错误:", eventRegistry.eventName, e);
                }
            }
        } catch(e){ //捕获事件执行错误，应该抛出（不过我也不知道这里能捕获到什么错误）
            //re-throw EventError
            const error = new EventError(eventRegistry, event, e);
            if (isDebug())
                logger.error(error);
            throw error;
        }
    }
    addListener<T extends {}>(listener: T){
        if (!(sEventListenerData in listener))
            throw new TypeError("not a listener");
        
        const cListener = listener as IEventListener<T>;
        const data = cListener[sEventListenerData];
        
        if (data.registeredListeners.size === 0)
        for (const entries of data.handlerEntries){
            const [tevent, prio, handler] = entries;
            EventRegistry.getRegistry(tevent).addHandler(handler, prio);
        }
        
        if (data.registeredListeners.has(listener))
            throw new Error("the listener already been registered");
        
        data.registeredListeners.add(listener);
        
    }
    removeListener<T extends {}>(listener: T){
        if (!(sEventListenerData in listener))
            throw new TypeError("not a listener");
        
        const cListener = listener as IEventListener<T>;
        const data = cListener[sEventListenerData];
        
        if (!data.registeredListeners.has(listener))
            return false;
        
        data.registeredListeners.delete(listener);
        
        if (data.registeredListeners.size === 0)
        for (const entries of data.handlerEntries){
            const [tevent, prio, handler] = entries;
            EventRegistry.getRegistry(tevent).removeHandler(handler, prio);
        }
        
        return true;
    }
    listenEvent<TEvent extends Function>(
        listenOptions: ListenEventOptions<TEvent>,
        callback: EventCallback<TEvent>
    ): SingleHandlerEventListener<TEvent>;
    listenEvent<TEvent extends Function>(
        event: TEvent,
        callback: EventCallback<TEvent>
    ): SingleHandlerEventListener<TEvent>;
    listenEvent<TEvent extends Function>(listenOptions: ListenEventOptions<TEvent> | TEvent, callback: EventCallback<TEvent>){
        return listenEvent(listenOptions as any, callback);
    }
}

export const eventManager = new EventManager();
export { eventManager as manager };
