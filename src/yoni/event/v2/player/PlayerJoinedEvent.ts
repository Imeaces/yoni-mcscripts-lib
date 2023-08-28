import {
  EventRegistry,
  eventManager,
  listenEvent } from "../index.js";
import { VanillaWorld, Minecraft } from "../../../basis.js";
import { YoniScheduler, Schedule } from "../../../schedule.js";
import { Player } from "../../../entity.js";
import { PlayerEvent } from "./PlayerEvent.js";

export class PlayerJoinedEvent extends PlayerEvent {
    constructor(player: Player | Minecraft.Player){
        super(player);
    }
    async kickPlayer(){
        await this.player.kick("加入游戏被取消");
    }
}

const eventRegistry = EventRegistry.register(PlayerJoinedEvent);

const joiningPlayers = new Set<string>();

const schedule = new Schedule({
    type: Schedule.cycleTickSchedule,
    async: false,
    delay: 0,
    period: 1
}, function testPlayer() {
    if (joiningPlayers.size === 0){
        stopDetect();
        return;
    }
    
    let joinedPlayers = [];
    for (const onlinePlayer of VanillaWorld.getPlayers()){
        if (joiningPlayers.has(onlinePlayer.name)){
            joiningPlayers.delete(onlinePlayer.name);
            joinedPlayers.push(onlinePlayer);
        }
    }
    
    for (const joinedPlayer of joinedPlayers){
        const event = new PlayerJoinedEvent(joinedPlayer);
        eventManager.callEvent(eventRegistry, event);
    }
});

listenEvent(Minecraft.PlayerJoinAfterEvent, 
function onJoin(event){
    joiningPlayers.add(event.playerName);
    startDetect();
});

function startDetect(){
    if (!schedule.isQueued()){
        YoniScheduler.addSchedule(schedule);
    }
}
function stopDetect(){
    if (schedule.isQueued()){
        YoniScheduler.removeSchedule(schedule);
    }
}
