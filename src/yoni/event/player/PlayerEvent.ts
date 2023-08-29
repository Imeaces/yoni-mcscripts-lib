import { Event } from "../index.js";
import { Minecraft } from "../../basis.js";
import { EntityUtils } from "../../EntityUtils.js";
import type { YoniPlayer } from "../../types";

const EntityTypes = Minecraft.EntityTypes;

export abstract class PlayerEvent extends Event {
    constructor(player: YoniPlayer | Minecraft.Player){
        super();
        this.#player = EntityUtils.from(player) as unknown as YoniPlayer;
    }
    #player: YoniPlayer;
    get player(){
        return this.#player;
    }
    eventType = EntityTypes.get("minecraft:player");
}
