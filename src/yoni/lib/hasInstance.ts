const isPrototypeOf = Object.prototype.isPrototypeOf;

export function hasInstance(value: any, clazz: Function): boolean {
    return Reflect.apply(isPrototypeOf, clazz.prototype, [value]);
}

function hasInstance0(value: any, clazz: Function): boolean {
    let proto = Object.getPrototypeOf(value);
    while (proto !== null){
        if (proto === clazz.prototype)
            return true;
        
        value = proto;
        proto = Object.getPrototypeOf(value);
    }
    return false;
}
//(value, clazz) => Reflect.apply(Object.prototype.isPrototypeOf, clazz.prototype, [value])