import { LegacyEvent as Event } from "../../legacy_event.js";
import { EntityBase } from "../../entity.js";
import { EntityValue } from "../../entity.js";

export class EntityEvent extends Event {
    readonly entity;
    readonly entityType;
    constructor(entity: EntityValue, ...args: any[]){
        super(...args);
        this.entity = EntityBase.getYoniEntity(entity);
        this.entityType = this.entity.entityType;
    }
}
