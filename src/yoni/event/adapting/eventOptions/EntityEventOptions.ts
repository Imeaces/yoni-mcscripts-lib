import { EntityValue } from "../../../types";
import { EntityUtils } from "../../../EntityUtils.js";

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
            if ((options.entityTypes as string[]).includes(entity.id))
                return true;
            
            return (options.entities as EntityValue[]).some(cEntity => EntityUtils.isSameEntity(cEntity, entity));
        };
    else if (options.entities && !options.entityTypes)
        condition = (entity) => {
            return (options.entities as EntityValue[]).some(cEntity => EntityUtils.isSameEntity(cEntity, entity));
        };
    else if (!options.entities && options.entityTypes)
        condition = (entity) => {
            return (options.entityTypes as string[]).includes(entity.id);
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

import { Minecraft } from "../../../basis.js";
import { EventRegistry } from "../../EventRegistry.js";

export function registerMinecraftEventOptionResolvers(){
(function (){
let registry = EventRegistry.getRegistry(Minecraft.EffectAddEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHitEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    entities.push(event.hitEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.EntityHurtEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.damagingEntity);
    entities.push(event.projectile);
    entities.push(event.hurtEntity);
    return conditionEntityEventOptions(entities, options);
}

})();

}