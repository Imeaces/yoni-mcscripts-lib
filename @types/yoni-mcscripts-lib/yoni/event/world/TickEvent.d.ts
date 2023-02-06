export class TickEventSignal extends EventSignal {
}
export class TickEvent extends Event {
    constructor(currentTick: any, deltaTime: any);
    get currentTick(): any;
    get deltaTime(): any;
}
import { EventSignal } from "../../event.js";
import { Event } from "../../event.js";
