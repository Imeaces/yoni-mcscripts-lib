export declare class EntityClassRegistry {
    #private;
    static get entityClassRegistry(): Map<any, any>;
    static get entityClassPrototypeRegistry(): Map<any, any>;
    static get entitySrcClassRegistry(): Map<any, any>;
    static get entitySrcClassPrototypeRegistry(): Map<any, any>;
    static from(entity: any): any;
    static register(entityClass: any, originalEntityClass: any): void;
    static unregister(entityClass: any, originalEntityClass: any): void;
}
