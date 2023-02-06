export class EntityMovementEventSignal extends EventSignal {
    subscribe(callback: any, options: any): void;
}
export class EntityMovementEvent extends EntityEvent {
    constructor(entity: any, from: any, to: any, movementKeys: any);
    /**
     * 如果取消跨维度移动事件的话，可能会导致游戏崩溃
     */
    set cancel(arg: boolean);
    get cancel(): boolean;
    get from(): any;
    get to(): any;
    #private;
}
import { EventSignal } from "../../event.js";
import { EntityEvent } from "./EntityEvent.js";
