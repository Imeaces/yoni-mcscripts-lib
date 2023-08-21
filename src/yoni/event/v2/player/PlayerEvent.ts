import { Event } from "../base/Event.js";
import { Minecraft } from "../../../basis.js";
import { EntityBase, Player } from "../../../entity.js";

const EntityTypes = Minecraft.EntityTypes;

export abstract class PlayerEvent extends Event {
    constructor(player: Player | Minecraft.Player){
        super();
        this.#player = EntityBase.from(player) as unknown as Player;
    }
    #player: Player;
    get player(){
        return this.#player;
    }
    eventType = EntityTypes.get("minecraft:player");
}
