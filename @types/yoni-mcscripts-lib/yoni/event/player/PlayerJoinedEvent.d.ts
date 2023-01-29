import { EventSignal } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
export declare class PlayerJoinedEvent extends PlayerEvent {
    constructor(player: any);
    kickPlayer(): Promise<void>;
}
export declare class PlayerDeadEventSignal extends EventSignal {
}
