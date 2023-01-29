import { IEventTrigger } from "./IEventTrigger.js";
import { IEventSignal } from "./IEventSignal.js";
import { Trigger } from "./Trigger.js";
declare class Signal implements IEventSignal {
    #private;
    get identifier(): string;
    get namespace(): string;
    get eventName(): string;
    constructor(identifier: any, trigger: IEventTrigger | Trigger);
    subscribe(callback: any, ...filters: any[]): any;
    unsubscribe(callback: any): any;
}
export default Signal;
export { Signal };
export { Signal as EventSignal };
