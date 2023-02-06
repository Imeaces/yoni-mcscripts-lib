import { Event } from "../../event.js";
import { Minecraft } from "../../basis.js";
import { Player } from "../../entity.js";
export declare class PlayerEvent extends Event {
    #private;
    constructor(player: Player, ...args: any[]);
    get player(): Player;
    eventType: Minecraft.EntityType;
}
export default PlayerEvent;
