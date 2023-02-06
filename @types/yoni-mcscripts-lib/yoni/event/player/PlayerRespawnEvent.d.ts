export class PlayerRespawnEventSignal extends EventSignal {
}
export class PlayerRespawnEvent extends PlayerEvent {
    constructor(player: any, coords: any);
    sourceLocation: any;
    currentLocation: Location & import("@minecraft/server").Vector3;
}
import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent";
import { Location } from "../../Location.js";
