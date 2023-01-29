import { Event } from "../../event.js";
export declare class EntityEvent extends Event {
    get entity(): any;
    get entityType(): any;
    constructor(entity: any, ...args: any[]);
}
