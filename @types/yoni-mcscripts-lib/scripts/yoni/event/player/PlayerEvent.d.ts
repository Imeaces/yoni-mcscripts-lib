import { Event } from "../../event.js";
import { Minecraft } from "../../basis.js";
export declare class PlayerEvent extends Event {
    #private;
    constructor(player: any, ...args: any[]);
    get player(): any;
    eventType: Minecraft.EntityType;
}
export default PlayerEvent;
