import { Event } from "../../event.js";
import { EntityValue } from "../../entity/EntityTypeDefs.js";
export declare class EntityEvent extends Event {
    readonly entity: import("../../entity/Entity.js").default;
    readonly entityType: import("@minecraft/server").EntityType;
    constructor(entity: EntityValue, ...args: any[]);
}
