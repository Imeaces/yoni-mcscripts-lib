import { EventSignal } from "../../event.js";
import { EntityEvent } from "./EntityEvent.js";
export declare class EntityMovementEventSignal extends EventSignal {
    subscribe(callback: any, options: any): void;
}
export declare class EntityMovementEvent extends EntityEvent {
    #private;
    get cancel(): boolean;
    /**
     * 如果取消跨维度移动事件的话，可能会导致游戏崩溃
     */
    set cancel(bool: boolean);
    get from(): any;
    get to(): any;
    constructor(entity: any, from: any, to: any, movementKeys: any);
}
