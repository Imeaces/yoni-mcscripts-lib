export class EntityMovementEvent extends EntityEvent {
    constructor(values: any);
    isCancelled: any;
    /**
     * 如果取消跨维度移动事件的话，可能会导致游戏崩溃
     */
    set cancel(arg: any);
    get cancel(): any;
    setCancel: any;
    oldLocation: any;
    newLocation: any;
}
import { EntityEvent } from "./EntityEvent.js";
