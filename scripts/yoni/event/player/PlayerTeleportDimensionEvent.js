import { EventSignal } from "yoni/event.js";
import { YoniScheduler } from "yoni/schedule.js";
import { PlayerEvent } from "./PlayerEvent.js";
import { World } from "yoni/world.js";

class PlayerTeleportDimensionEvent extends PlayerEvent {
    oldDimension;
    newDimension;
    constructor(player, oldDimension, newDimension){
        super(player);
        this.oldDimension = oldDimension;
        this.newDimension = newDimension;
    }
}

let taskId = null;
const PlayerDimRecords = new WeakMap();

function start(){
    taskId = YoniScheduler.runCycleTickTask(()=>{
        World.getPlayers().forEach((player)=>{
            let oldDim = PlayerDimRecords.get(player);
            let newDim = null;
            if (oldDim === undefined){
                ;
            } else if (oldDim !== player.dimension){
                newDim = player.dimension;
            }
            PlayerDimRecords.set(player, player.dimension);
            if (newDim !== null){
                signal.triggerEvent(player, oldDim, newDim);
            }
        });
    }, 0, 1);
}

function stop(){
    YoniScheduler.removeSchedule(taskId);
}

const signal = EventSignal.builder("yoni:playerTeleportDimension")
    .eventClass(PlayerTeleportDimensionEvent)
    .build()
    .whenFirstSubscribe(start)
    .whenLastUnsubscribe(stop)
    .registerEvent();