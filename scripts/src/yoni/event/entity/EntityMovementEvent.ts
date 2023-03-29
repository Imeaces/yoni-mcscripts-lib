import { EventSignal, EventTriggerBuilder } from "../../event.js";
import { EntityEvent } from "./EntityEvent.js";
import { EntityValue } from "../../entity/EntityTypeDefs.js";
import { EntityBase } from "../../entity.js";
import { YoniEntity } from "../../entity.js";
import { Location } from "../../Location.js";
import { YoniScheduler, Schedule } from "../../schedule.js";
import { World } from "../../world.js";

export class EntityMovementEventSignal extends EventSignal {
    subscribe(callback: (arg: EntityMovementEvent) => void, options?: EntityMovementEventOption){
        super.subscribe(callback, options);
        if (options != null){
            filtersList.push(options);
        }
        return callback;
    }
}

//这个事件非常卡，我相信你们不会想要使用它的
export class EntityMovementEvent extends EntityEvent {
    #cancelled = false;
    get cancel(){
        return this.#cancelled;
    }
    
    /**
     * 如果取消跨维度移动事件的话，可能会导致游戏崩溃
     */
    set cancel(bool){
        if (this.#cancelled) return;
        if (bool){
            this.#cancelled = true;
            this.entity.teleport(this.from);
        }
    }
    
    get from(){
        return this.#from.clone();
    }
    get to(){
        return this.#to.clone();
    }
    get movementKeys(){
        return this.#movementKeys.slice(0);
    }
    constructor(entity: YoniEntity, from: Location, to: Location, movementKeys: MovementKey[]){
        super(entity);
        this.#from = from;
        this.#to = to;
        this.#movementKeys = movementKeys;
    }
    #movementKeys;
    #to;
    #from;
}

let entityLocationRecords = new WeakMap<YoniEntity, Location>();

const filtersList: EntityMovementEventOption[] = [];

type MovementKey = "dimension" | "x" | "y" | "z" | "location" | "rx" | "ry" | "rotation";
interface EntityMovementEventOption {
    entities?: EntityValue[];
    entityTypes?: string[];
    movementKeys?: MovementKey[];
}

function getTargetEntities(): YoniEntity[] {
    if (filtersList.length === 0){
        return World.getLoadedEntities();
    }
    const selectedEntities: YoniEntity[] = [];
    const allEntities = World.getLoadedEntities();
    filtersList.forEach(filter => {
        if (filter.entities){
            filter.entities.map(entity => EntityBase.getYoniEntity(entity))
                .forEach(entity => {
                    selectedEntities.push(entity);
                });
        }
        if (filter.entityTypes){
            allEntities
                .filter(oneEntity => {
                    return (filter.entityTypes as Array<string>).includes(oneEntity.typeId);
                })
                .forEach(oneEntity => {
                    selectedEntities.push(oneEntity);
                });
        }
    });
    return Array.from(
        new Set(
            selectedEntities.map(e =>
                EntityBase.getYoniEntity(e)
            )
        )
    );
}

const schedule = new Schedule ({
    async: false,
    type: Schedule.tickCycleSchedule,
    period: 1,
    delay: 0
}, ()=>{
    for (const entity of getTargetEntities()){
        let oldLoc = entityLocationRecords.get(entity);
        if (oldLoc === undefined){
            entityLocationRecords.set(entity, entity.location);
            continue;
        }
        let newLoc = entity.location;
        if (newLoc.equals(oldLoc)){
            continue;
        }
        let movementKeys: MovementKey[] = [];
        if (newLoc.x !== oldLoc.x){
            movementKeys.push("x", "location");
        }
        if (newLoc.y !== oldLoc.y){
            movementKeys.push("y", "location");
        }
        if (newLoc.z !== oldLoc.z){
            movementKeys.push("z", "location");
        }
        if (newLoc.rx !== oldLoc.rx){
            movementKeys.push("rx", "rotation");
        }
        if (newLoc.ry !== oldLoc.ry){
            movementKeys.push("ry", "rotation");
        }
        if (newLoc.dimension !== oldLoc.dimension){
            movementKeys.push("x", "y", "z", "rx", "ry", "dimension", "location", "rotation");
        }
        
        movementKeys = Array.from(new Set(movementKeys));
        
        trigger.triggerEvent(entity, oldLoc, newLoc, movementKeys);
    }
});

const trigger = new EventTriggerBuilder()
    .id("yoni:entityMovement")
    .eventSignalClass(EntityMovementEventSignal)
    .eventClass(EntityMovementEvent)
    .filterResolver((values: [YoniEntity, Location, Location, MovementKey[]],
        filterValues: EntityMovementEventOption)=>{
        
        const [entity, from, to, movementKeys] = values;
        
        if (filterValues.movementKeys != null){
            for (const key of filterValues.movementKeys){
                if ( ! movementKeys.includes(key)){
                    return false;
                }
            }
        }
        
        if (filterValues.entities != null){
            let found = false;
            for (let filterEntity of filterValues.entities){
                if (EntityBase.isSameEntity(filterEntity, entity)){
                    found = true;
                    break;
                }
            }
            if (!found){
                return false;
            }
        }
        
        if (filterValues.entityTypes != null){
            return filterValues.entityTypes.includes(entity.typeId);
        }
        
        return true;
    })
    .whenFirstSubscribe(()=>{
        YoniScheduler.addSchedule(schedule);
    })
    .whenLastUnsubscribe(()=>{
        YoniScheduler.removeSchedule(schedule);
    })
    .build()
    .registerEvent();
