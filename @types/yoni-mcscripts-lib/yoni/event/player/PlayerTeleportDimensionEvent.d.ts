export class PlayerTeleportDimensionEvent extends PlayerEvent {
    constructor(player: any, fromDimension: any, toDimension: any);
    fromDimension: any;
    toDimension: any;
}
export class PlayerTeleportDimensionEventSignal extends EventSignal {
}
import { PlayerEvent } from "./PlayerEvent.js";
import { EventSignal } from "../../event.js";
