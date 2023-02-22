import { EventListener, EventSignal, EventTriggerBuilder } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
import { VanillaWorld, Minecraft } from "../../basis.js";
import { YoniScheduler, Schedule } from "../../schedule.js";

export class PlayerJoinedEvent extends PlayerEvent {
    constructor(player){
        super(player);
    }
    async kickPlayer(){
        await this.player.kick("加入游戏被取消");
    }
}

export class PlayerJoinedEventSignal extends EventSignal {
}

const joiningPlayers = new Set();
/**
 * @type {number | null}
 */
let eventId = null;

const schedule = new Schedule({
    type: Schedule.tickCycleSchedule,
    async: false,
    delay: 0,
    period: 0
}, () => {
    if (joiningPlayers.size === 0){
        return;
    }
    
    [...VanillaWorld.getPlayers()].forEach((pl)=>{
        if (joiningPlayers.has(pl)){
            joiningPlayers.delete(pl);
            trigger.triggerEvent(pl);
        }
    });
});

const trigger = new EventTriggerBuilder()
    .id("yoni:playerJoined")
    .eventSignalClass(PlayerJoinedEventSignal)
    .eventClass(PlayerJoinedEvent)
    .whenFirstSubscribe(()=>{
        YoniScheduler.addSchedule(schedule);
        eventId = EventListener.register("minecraft:playerJoin", (event)=>{
            joiningPlayers.add(event.player);
        });
    })
    .whenLastUnsubscribe(()=>{
        YoniScheduler.removeSchedule(schedule);
        EventListener.unregister(eventId);
    })
    .build();

if ("player" in Minecraft.PlayerJoinEvent.prototype)
    trigger.registerEvent();
else
    import("./PlayerJoinedEvent.v1.19.60.js");