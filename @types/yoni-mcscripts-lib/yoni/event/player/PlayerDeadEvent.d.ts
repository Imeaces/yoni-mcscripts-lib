import { PlayerEvent } from "./PlayerEvent.js";
import { EventSignal } from "../../event.js";
import { Player } from "yoni/entity.js";
export declare class PlayerDeadEvent extends PlayerEvent {
    constructor(player: Player);
}
export declare class PlayerDeadEventSignal extends EventSignal {
}
