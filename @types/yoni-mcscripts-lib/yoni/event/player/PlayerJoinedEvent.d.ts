export class PlayerJoinedEvent extends PlayerEvent {
    constructor(player: any);
    kickPlayer(): Promise<void>;
}
export class PlayerDeadEventSignal extends EventSignal {
}
import { PlayerEvent } from "./PlayerEvent.js";
import { EventSignal } from "../../event.js";
