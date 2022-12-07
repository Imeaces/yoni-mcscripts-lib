export class EntityEvent {
    constructor(entity: any, ...args: any[]);
    entity: any;
    get entityType(): any;
}
