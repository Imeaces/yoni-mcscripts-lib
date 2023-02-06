export class EntityEvent extends Event {
    constructor(entity: any, ...args: any[]);
    get entity(): any;
    get entityType(): any;
}
import { Event } from "../../event.js";
