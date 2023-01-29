import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent";
export declare class PlayerRespawnEventSignal extends EventSignal {
}
export declare class PlayerRespawnEvent extends PlayerEvent {
    sourceLocation: any;
    currentLocation: any;
    constructor(player: any, coords: any);
}
