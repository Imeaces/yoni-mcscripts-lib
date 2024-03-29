import { EventCallbacks } from "./Event.js";
import { IEventSignal } from "./IEventSignal.js";

/**
 * @deprecated 废弃，等待重写
 */
export interface IEventTrigger {
    
    constructor(identifier: string, signal: IEventSignal): IEventTrigger;
    
    signal: IEventSignal;
    
    getCallbacks: () => EventCallbacks;
    
    filterResolver(eventValues: any[], filters: any[] | any): boolean
    
    triggerEvent(...eventValues: any[]): void;
    registerEvent(): void;
    unregisterEvent(): void;
}
