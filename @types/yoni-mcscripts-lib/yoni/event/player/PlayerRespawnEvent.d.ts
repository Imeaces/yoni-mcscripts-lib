import { Player } from "../../entity.js";
import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent";
import { Location } from "../../Location.js";
export declare class PlayerRespawnEventSignal extends EventSignal {
}
export declare class PlayerRespawnEvent extends PlayerEvent {
    sourceLocation: Location;
    currentLocation: Location;
    constructor(player: Player, coords: Location);
}
