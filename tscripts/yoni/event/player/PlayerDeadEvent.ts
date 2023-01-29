// @ts-nocheck
import { EventListener, EventSignal, EventTriggerBuilder } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
import { EntityBase } from "../../entity.js";
import { overworld } from "../../basis.js";

export class PlayerDeadEvent extends PlayerEvent {
    constructor(player){
        super(player);
    }
}
export class PlayerDeadEventSignal extends EventSignal {}

let eventId0 = null;
let eventId1 = null;

const trigger = new EventTriggerBuilder()
    .id("yoni:playerDead")
    .eventSignalClass(PlayerDeadEventSignal)
    .eventClass(PlayerDeadEvent)
    .whenFirstSubscribe(()=>{
        eventId0 = EventListener.register("minecraft:entityHurt", (event)=>{
            if (event.hurtEntity.typeId !== "minecraft:player"){
                return;
            }
            if (EntityBase.getCurrentHealth(event.hurtEntity) === 0){
                trigger.triggerEvent(event.hurtEntity);
            }
        }, { entityTypes: ["minecraft:player"] });
        eventId1 = EventListener.register("yoni:playerJoined", (event)=>{
            if (EntityBase.getCurrentHealth(event.player) === 0){
                trigger.triggerEvent(event.player);
            }
        });
    })
    .whenLastUnsubscribe(()=>{
        EventListener.unregister(eventId0);
        EventListener.unregister(eventId1);
    })
    .build();

if (overworld.runCommand)
    import("./PlayerDeadEvent.v1.19.30.js");
else
    trigger.registerEvent();
