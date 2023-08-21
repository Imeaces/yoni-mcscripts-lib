import { Player } from "../../entity.js";
import { LegacyEventTypes as EventTypes, LegacyEventSignal as EventSignal, LegacyEventTriggerBuilder as EventTriggerBuilder } from "../../legacy_event.js";
import { PlayerEvent } from "./PlayerEvent";
import { YoniScheduler, Schedule } from "../../schedule.js";
import { Location } from "../../Location.js";
import { PlayerDeadEvent } from "./PlayerDeadEvent.js";
import { world as World } from "../../world.js";
import "./PlayerDeadEvent.js";

export class PlayerRespawnEventSignal extends EventSignal {}
export class PlayerRespawnEvent extends PlayerEvent {
    sourceLocation: Location;
    currentLocation: Location;
    constructor(player: Player, coords: Location){
        super(player);
        this.sourceLocation = coords;
        this.currentLocation = this.player.location;
    }
}

const DeadPlayers = new WeakSet();
const DeadPlayerLocationRecords = new WeakMap();

/**
 * @type {number}
 */
let eventId0: number;

const schedule = new Schedule({
    async: false,
    type: Schedule.cycleTickSchedule,
    delay: 0,
    period: 1
}, ()=>{
    let players: Player[] = Array.from(World.getPlayers());
    if (players.length === 0){
        YoniScheduler.removeSchedule(schedule);
        return;
    }
    players.forEach(player=>{
        if (!DeadPlayers.has(player)){
            return;
        }
        if (player.getCurrentHealth() > 0){
            let location = DeadPlayerLocationRecords.get(player);
            DeadPlayers.delete(player);
            DeadPlayerLocationRecords.delete(player);
            trigger.fireEvent(player, location);
        }
    });
});;

function start(){
    EventTypes.get("yoni:playerDead").subscribe(onDead);
}

function onDead(event: PlayerDeadEvent){
    let player = event.player;
    let location = player.location;
    DeadPlayers.add(player);
    DeadPlayerLocationRecords.set(player, location);
    if (!schedule.isQueued()){
        YoniScheduler.addSchedule(schedule);
    }
}

function stop(){
    EventTypes.get("yoni:playerDead").unsubscribe(onDead);
    YoniScheduler.removeSchedule(schedule);
}

const trigger = new EventTriggerBuilder("yoni:playerRespawn")
    .eventSignalClass(PlayerRespawnEventSignal)
    .eventClass(PlayerRespawnEvent)
    .whenFirstSubscribe(start)
    .whenLastUnsubscribe(stop)
    .build()
    .registerEvent();
