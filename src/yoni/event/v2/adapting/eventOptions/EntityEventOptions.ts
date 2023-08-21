import { EntityValue } from "../../../../entity/EntityTypeDefs.js";
import { EntityBase } from "../../../../entity/EntityBase.js";

export interface EntityEventOptions {
    entities?: EntityValue[]
    entityTypes?: string[]
}

export interface EntityDataDrivenTriggerEventOptions extends EntityEventOptions {
    eventTypes?: string[]
}

export function conditionEntityEventOptions(entities: EntityValue[], options: EntityEventOptions): boolean {
    let condition: (entity: EntityValue) => boolean;
    if (options.entities && options.entityTypes)
        condition = (entity) => {
            if ((options.entityTypes as string[]).includes(entity.typeId))
                return true;
            
            return (options.entities as EntityValue[]).some(cEntity => EntityBase.isSameEntity(cEntity, entity));
        };
    else if (options.entities && !options.entityTypes)
        condition = (entity) => {
            return (options.entities as EntityValue[]).some(cEntity => EntityBase.isSameEntity(cEntity, entity));
        };
    else if (!options.entities && options.entityTypes)
        condition = (entity) => {
            return (options.entityTypes as string[]).includes(entity.typeId);
        };
    else if (!options.entities && !options.entityTypes)
        return true;
    else
        throw new TypeError("unknown entity options");
    
    for (const entity of entities){
        if (condition(entity))
            return true;
    }
    
    return false;
}

export function conditionEntityDataDrivenTriggerEventOptions(id: string, entities: EntityValue[], options: EntityDataDrivenTriggerEventOptions): boolean {
    if (options.eventTypes && options.eventTypes.includes(id))
        return true;
    return conditionEntityEventOptions(entities, options);
}

import { Minecraft } from "../../../../basis.js";
import { EventRegistry } from "../../EventRegistry.js";

export function registerMinecraftEventOptionResolvers(){
(function (){
let registry = EventRegistry.getRegistry(Minecraft.EffectAddAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityDieAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.deadEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHealthChangedAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHitBlockAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.damagingEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHitEntityAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.damagingEntity);
    entities.push(event.hitEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHurtAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.damageSource?.damagingEntity);
    entities.push(event.damageSource?.damagingProjectile);
    entities.push(event.hurtEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityRemovedAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    if (!options.entities) return true;
    
    let id = event.removedEntity;

    for (const entity of options.entities){
        if (entity.id === id)  return true;
    }
    
    return false;
}

})();
}