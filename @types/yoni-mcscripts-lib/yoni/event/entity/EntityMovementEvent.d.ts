import { EventSignal } from "../../event.js";
import { EntityEvent } from "./EntityEvent.js";
import { EntityValue } from "../../entity/EntityTypeDefs.js";
import { YoniEntity } from "../../entity.js";
import { Location } from "../../Location.js";
export declare class EntityMovementEventSignal extends EventSignal {
    subscribe(callback: (arg: EntityMovementEvent) => void, options?: EntityMovementEventOption): (arg: EntityMovementEvent) => void;
}
export declare class EntityMovementEvent extends EntityEvent {
    #private;
    get cancel(): boolean;
    /**
     * 如果取消跨维度移动事件的话，可能会导致游戏崩溃
     */
    set cancel(bool: boolean);
    get from(): Location;
    get to(): Location;
    get movementKeys(): MovementKey[];
    constructor(entity: YoniEntity, from: Location, to: Location, movementKeys: MovementKey[]);
}
declare type MovementKey = "dimension" | "x" | "y" | "z" | "location" | "rx" | "ry" | "rotation";
interface EntityMovementEventOption {
    entities?: EntityValue[];
    entityTypes?: string[];
    movementKeys?: MovementKey[];
}
export {};
