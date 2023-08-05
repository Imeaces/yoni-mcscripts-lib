import { EventTypes, EventTriggerBuilder, EventSignal, Event } from "../../../event.js";
import { EntityBase } from "../../../entity.js";

class RaidEventTriggerEvent extends Event {
    #source;
    get source(){
        return this.#source;
    }
    get id(){
        return "minecraft:raid_trigger";
    }
    constructor(source){
        super();
        this.#source = source;
    }
}
class RaidEventTriggerEventSignal extends EventSignal {
}

let eventId = null;
function start(){
    let options;
    try { //兼容1.19.30
        options = new Minecraft.EntityDataDrivenTriggerEventOptions();
    } catch {
        options = {};
    }
    options.entityTypes = ["minecraft:player"];
    options.eventTypes = ["minecraft:trigger_raid"];
    EventTypes.get("minecraft:dataDrivenEntityTriggerEvent")
        .subscribe(onEntityEvent, options);
}
function stop(){
    EventTypes.get("minecraft:dataDrivenEntityTriggerEvent")
        .unsubscribe(onEntityEvent);
}

let trigger = new EventTriggerBuilder("yoni:raidEventTrigger")
    .eventSignalClass(RaidEventTriggerEventSignal)
    .eventClass(RaidEventTriggerEvent)
    .whenFirstSubscribe(start)
    .whenLastUnsubscribe(stop)
    .build()
    .registerEvent();

function onEntityEvent(event){
    if (event.entity.typeId === "minecraft:player")
         trigger.fireEvent(EntityBase.from(event.entity));
}