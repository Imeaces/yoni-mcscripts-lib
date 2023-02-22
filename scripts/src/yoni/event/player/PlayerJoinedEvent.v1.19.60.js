import { EventListener, EventSignal, EventTriggerBuilder } from "../../event.js";
import { PlayerEvent } from "./PlayerEvent.js";
import { VanillaWorld } from "../../basis.js";
import { YoniScheduler, Schedule } from "../../schedule.js";
import { PlayerJoinedEvent, PlayerJoinedEventSignal } from "./PlayerJoinedEvent.js";

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
    
    let onlinePlayers = Array.from(VanillaWorld.getPlayers());
    
    joiningPlayers.forEach((plName)=>{
        let pl = onlinePlayers.find(pl => pl.name === plName);
        if (pl != null){
            joiningPlayers.delete(plName);
            trigger.triggerEvent(pl);
        }
    });
});

const trigger = new EventTriggerBuilder()
    .id("yoni:playerJoined")
    .eventSignalClass(PlayerDeadEventSignal)
    .eventClass(PlayerJoinedEvent)
    .whenFirstSubscribe(()=>{
        YoniScheduler.addSchedule(schedule);
        eventId = EventListener.register("minecraft:playerJoin", (event)=>{
            joiningPlayers.add(event.playerName);
        });
    })
    .whenLastUnsubscribe(()=>{
        YoniScheduler.removeSchedule(schedule);
        EventListener.unregister(eventId);
    })
    .build()
    .registerEvent();
