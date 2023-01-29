import { EventSignal, Event } from "../../event.js";
export declare class TickEventSignal extends EventSignal {
}
export declare class TickEvent extends Event {
    get currentTick(): any;
    get deltaTime(): any;
    constructor(currentTick: any, deltaTime: any);
}
