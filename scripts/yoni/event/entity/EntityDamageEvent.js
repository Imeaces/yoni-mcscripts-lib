import { EventListener, EventSignal, EventTypes, EventRemover } from "yoni/event.js";
import { EntityEvent } from "./EntityEvent.js";
import { runTask, Minecraft } from "yoni/basis.js";
import { Entity } from "yoni/entity.js";
const { Location, BlockLocation } = Minecraft;

const damageTypesCauseByBlock = new Set()
    .add("lava")
    .add("blockExplosion")
    .add("contact")
    .add("freezing")
    .add("magma");

class EntityDamageEvent extends EntityEvent {
    damage;
    cause;
    constructor(entity, damage, cause, ...values){
        super(entity);
        this.damage = damage;
        this.cause = cause;
    }
}

class EntityDamageByEntityEvent extends EntityDamageEvent {
    damager;
    source;
    isProjectileDamage(){}
    constructor(entity, damage, cause, values){
        let { isProjectileDamage } = values;
        super(entity, damage, cause);
        this.damager = values.damager;
        this.source = values.source;
        this.isProjectileDamage = ()=>{ return isProjectileDamage; };
    }
}
class EntityDamageByBlockEvent extends EntityDamageEvent {
    damager;
    constructor(entity, damage, cause, damager){
        super(entity, damage, cause);
        this.damager = damager;
    }
}

const fireEvent = (event)=>{
    let { hurtEntity, damage, cause } = event;
    signal0.triggerEvent(hurtEntity, damage, cause);
};
const fireEventThatTriggerByEntity = (event) => {
    let source, damager;
    const { hurtEntity, cause, damage, damagingEntity, projectile } = event;
    
    source = Entity.from(damagingEntity);
    
    let isProjectileDamage = false;
    if (projectile !== undefined){
        isProjectileDamage = true;
        damager = Entity.from(projectile);
    }
    if (damager === undefined){
        damager = Entity.from(source);
    }
    if (source === undefined){
        source = Entity.from(damager);
    }
    const values = {source,damager,isProjectileDamage};
    signal0.triggerEvent(hurtEntity, damage, cause, values);
};
const fireEventThatTriggerByBlock = (event)=>{
    return; //because not implemented yet.
    let { hurtEvent, damage, cause } = event;
    if (!damageTypesCauseByBlock.has(cause)){
        return;
    }
    let entLoc = hurtEntity.location;
    let blockLoc = new Minecraft.BlockLocation(
        Math.floor(entLoc.x),
        Math.floor(entLoc.y),
        Math.floor(entLoc.z)
    );
    let block = hurtEntity.dimension.getBlock(blockLoc);
    signal2.triggerEvent(hurtEntity, damage, cause, block);
};

let usedEvent = new Set();
let eventIds = [null, null, null];
let registeredTypeCount = 0;

const dealCount = ()=>{
    if (registeredTypeCount === 0){
        eventIds.forEach(k=>(k!==null)?EventListener.unregister(k):0);
    } else {
        if (eventIds[0] === null && usedEvent.has(signal0)){
            eventIds[0] = EventListener.register("minecraft:entityHurt", (event)=>{
                fireEvent(event);
            });
        }
        if (eventIds[1] === null && usedEvent.has(signal1)){
            eventIds[1] = EventListener.register("minecraft:entityHurt", (event)=>{
                if ("damagingEntity" in event || "projectile" in event){
                    fireEventThatTriggerByEntity(event);
                }
            });
        }
        if (eventIds[2] === null && usedEvent.has(signal2)){
            eventIds[2] = EventListener.register("minecraft:entityHurt", (event)=>{
                if (!("damagingEntity" in event) && !("projectile" in event)){
                    fireEventThatTriggerByBlock(event);
                }
            });
        }
        if (eventIds[0] !== null && !usedEvent.has(signal0)){
            EventListener.unregister(eventIds[0]);
            eventIds[0] = null;
        }
        if (eventIds[1] !== null && !usedEvent.has(signal1)){
            EventListener.unregister(eventIds[1]);
            eventIds[1] = null;
        }
        if (eventIds[2] !== null && !usedEvent.has(signal2)){
            EventListener.unregister(eventIds[1]);
            eventIds[2] = null;
        }
    }
};

const signal0 = EventSignal.builder("yoni:entityDamage")
    .eventClass(EntityDamageEvent)
    .build()
    .whenFirstSubscribe(()=>{
        usedEvent.add(signal0);
        registeredTypeCount += 1;
        dealCount();
    })
    .whenLastUnsubscribe(()=>{
        usedEvent.delete(signal0);
        registeredTypeCount -= 1;
        dealCount();
    });
const signal1 = EventSignal.builder("yoni:entityDamageByEntity")
    .eventClass(EntityDamageByEntityEvent)
    .build()
    .whenFirstSubscribe(()=>{
        usedEvent.add(signal1);
        registeredTypeCount += 1;
        dealCount();
    })
    .whenLastUnsubscribe(()=>{
        usedEvent.delete(signal1);
        registeredTypeCount -= 1;
        dealCount();
    });
const signal2 = EventSignal.builder("yoni:entityDamageByBlock")
    .eventClass(EntityDamageByBlockEvent)
    .build()
    .onSubscribe(()=>{
        //写得差不多了才发现根本做不到
        throw new Error("not implemented yet");
    })
    .whenFirstSubscribe(()=>{
        usedEvent.add(signal2);
        registeredTypeCount += 1;
        dealCount();
    })
    .whenLastUnsubscribe(()=>{
        usedEvent.delete(signal2);
        registeredTypeCount -= 1;
        dealCount();
    });
    
signal0.registerEvent();
signal1.registerEvent();
//signal2.registerEvent();
