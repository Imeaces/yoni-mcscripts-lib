export class EntityWraps {
    static map = new WeakMap<Object, Object>();
    
    static classWraps = new Map<Function, Function>();
    static prototypeWraps = new Map<Object, Function>();
    static srcClassWraps = new Map<Function, Function>();
    static srcPrototypeWraps = new Map<Object, Function>();
    
    static fromSourceEntity(entity: any){
        const srcProto = Object.getPrototypeOf(entity);
        const wrappedClass = this.prototypeWraps.get(srcProto);
        
        if (!wrappedClass)
            return null;
        
        let wrappedEntity = this.map.get(entity);
        
        if (!wrappedEntity){
            wrappedEntity = new (wrappedClass as (new (...args: any[]) => any))(entity) as any;
            this.map.set(entity, wrappedEntity as any);
        }
        
        return wrappedEntity;
    }
    static registerWrap(entityClass: Function, originalEntityClass: Function){
        const srcProto = originalEntityClass.prototype;
        const proto = entityClass.prototype;
        
        this.classWraps.set(originalEntityClass, entityClass);
        this.prototypeWraps.set(srcProto, entityClass);
        
        this.srcClassWraps.set(entityClass, originalEntityClass);
        this.srcPrototypeWraps.set(proto, originalEntityClass);
    }
    static unregisterWrap(originalEntityClass: Function){
        const srcProto = originalEntityClass.prototype;
        const entityClass = this.classWraps.get(originalEntityClass) as Function;
        const proto = entityClass.prototype;
        
        this.classWraps.delete(originalEntityClass);
        this.prototypeWraps.delete(srcProto);
        
        this.srcClassWraps.delete(entityClass);
        this.srcPrototypeWraps.delete(proto);
    }
}
