import { YoniEntity } from "yoni/entity.js";
import { EventListener, EventSignal, Event } from "yoni/event.js";
import { VanillaWorld } from "yoni/basis.js";
import { YoniScheduler } from "yoni/schedule.js";

class PlayerJoinedEvent extends Event {
    player;
    constructor(player){
        super();
        Object.defineProperty(this, "player", {
            value: YoniEntity.from(player),
            writable: false,
            enumerable: true
        });
    }
    kickPlayer(){
        this.player.postKick("加入游戏被取消");
    }
}

let joiningPlayers = new Set();
let 启用轮询 = false;
let eventId = null;

let ticking = ()=>{
    if (启用轮询){
        runTask(ticking);
    }
    if (joiningPlayers.size === 0){
        return;
    }
    
    [...VanillaWorld.getPlayers()].forEach((pl)=>{
        if (joiningPlayers.has(pl)){
            joiningPlayers.delete(pl);
            signal.triggerEvent(pl);
        }
    });
}
let scheduleId = -1;

const signal = EventSignal.builder("yoni:playerJoined")
    .eventClass(PlayerJoinedEvent)
    .build()
    .whenFirstSubscribe(()=>{
        启用轮询 = true;
        runTask(ticking);
        eventId = EventListener.register("minecraft:playerJoin", (event)=>{
            joiningPlayers.add(event.player);
        });
    })
    .whenLastUnsubscribe(()=>{
        启用轮询 = false;
        EventListener.unregister(eventId);
    })
    .registerEvent();
