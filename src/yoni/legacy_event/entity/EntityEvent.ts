import { LegacyEvent as Event } from "../../legacy_event.js";
import { EntityUtils as EntityBase } from "../../index.js";
import { EntityValue } from "../../types";

export class EntityEvent extends Event {
    readonly entity;
    readonly entityType;
    constructor(entity: EntityValue, ...args: any[]){
        super(...args);
        this.entity = EntityBase.getYoniEntity(entity);
        this.entityType = this.entity.entityType;
    }
}
