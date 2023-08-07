import IEventHandler from "./interfaces/EventHandler";
import { logger } from "../logger.js";
import { EventError } from "./EventError.js";
import { EventRegistry } from "./EventRegistry.js";

export class EventManager {
    callEvent<T extends EventRegistry<TEvent>, TEvent extends Function = T["eventClass"], E extends {} = TEvent["prototype"]>(eventRegistry: T, event: E, noExtendsAlways: boolean = false){
        eventRegistry.sortHandlers();
        
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
                
                if (eventRegistry.extraOption
                && handler.option && eventRegistry.extraOptionResolver
                && !eventRegistry.extraOptionResolver(event, handler.option)){
                    continue; //跳过，由于未满足条件
                }
                
                try { //捕获事件处理错误，并输出日志
                    handler.onEvent(event);
                } catch(e){
                    logger.error(e);
                }
            }
        } catch(e){ //捕获事件执行错误，应该抛出
            //re-throw EventError
            throw new EventError(eventRegistry, event, e);
        }
    }
}

export const manager = new EventManager();
