import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
export declare class PlayerTeleportDimensionEvent extends PlayerEvent {
    fromDimension: any;
    toDimension: any;
    constructor(player: any, fromDimension: any, toDimension: any);
}
export declare class PlayerTeleportDimensionEventSignal extends EventSignal {
}
