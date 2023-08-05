export function hasInstance(value: any, clazz: Function): boolean {
    let proto = Object.getPrototypeOf(value);
    while (proto !== null){
        if (proto === clazz.prototype)
            return true;
        
        value = proto;
        proto = Object.getPrototypeOf(value);
    }
    return false;
}