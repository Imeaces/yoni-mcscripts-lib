import { EntityValue } from "../../../types";
import { EntityEventOptions, conditionEntityEventOptions } from "./EntityEventOptions.js";

export interface EntityDataDrivenTriggerEventOptions extends EntityEventOptions {
    eventTypes?: string[]
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
let registry = EventRegistry.getRegistry(Minecraft.DataDrivenEntityTriggerBeforeEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    return conditionEntityDataDrivenTriggerEventOptions(event.id, entities, options);
}

})();

(function (){
let registry = EventRegistry.getRegistry(Minecraft.DataDrivenEntityTriggerAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const entities: any[] = [];
    entities.push(event.entity);
    return conditionEntityDataDrivenTriggerEventOptions(event.id, entities, options);
}

})();

}