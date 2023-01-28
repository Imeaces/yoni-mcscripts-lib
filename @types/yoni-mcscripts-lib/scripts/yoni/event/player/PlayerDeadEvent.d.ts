import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
export declare class PlayerDeadEvent extends PlayerEvent {
    constructor(player: any);
}
export declare class PlayerDeadEventSignal extends EventSignal {
}
