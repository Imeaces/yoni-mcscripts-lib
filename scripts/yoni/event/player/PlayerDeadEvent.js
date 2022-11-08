import { YoniEntity } from "yoni/entity.js";
import { EventListener, EventSignal } from "yoni/event.js";
import { PlayerEvent } "./PlayerEvent.js";

export class PlayerDeadEvent extends PlayerEvent {
    constructor(player){
        super(player);
        Object.freeze(this);
    }
}

let eventId;

const signal = EventSignal.builder("yoni:playerDead")
    .eventClass(PlayerDeadEvent)
    .build()
    .whenFirstSubscribe(()=>{
        eventId = EventListener.register("minecraft:entityHurt", (event)=>{
            if (event.hurtEntity.typeId !== "minecraft:player"){
                return;
            }
            if (YoniEntity.getCurrentHealth(event.hurtEntity) === 0){
                signal.triggerEvent(event.hurtEntity);
            }
        }, {type:"minecraft:player"});
    })
    .whenLastUnsubscribe(()=>{
        EventListener.unregister(eventId);
    })
    .registerEvent()
