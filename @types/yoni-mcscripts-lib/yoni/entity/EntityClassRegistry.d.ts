export class EntityClassRegistry {
    static "__#7@#entityMap": WeakMap<object, any>;
    static "__#7@#entityClassRegistry": Map<any, any>;
    static get entityClassRegistry(): Map<any, any>;
    static "__#7@#entityClassPrototypeRegistry": Map<any, any>;
    static get entityClassPrototypeRegistry(): Map<any, any>;
    static "__#7@#entitySrcClassRegistry": Map<any, any>;
    static get entitySrcClassRegistry(): Map<any, any>;
    static "__#7@#entitySrcClassPrototypeRegistry": Map<any, any>;
    static get entitySrcClassPrototypeRegistry(): Map<any, any>;
    static from(entity: any): any;
    static register(entityClass: any, originalEntityClass: any): void;
    static unregister(entityClass: any, originalEntityClass: any): void;
    static includesInSrcPrototype(object: any): boolean;
    static includesInMappedPrototype(object: any): boolean;
    static includesInSrcClass(object: any): boolean;
    static includesInMappedClass(object: any): boolean;
}
