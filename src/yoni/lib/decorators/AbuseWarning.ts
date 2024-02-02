export function MethodAbuseWarning(message?: string): MethodDecorator {
    return function make(target: Object, propKey: string | symbol, propDesc: PropertyDescriptor){
        let warning = true;
        const className = target.constructor.name;
        const propKeyStr = String(propKey);
        const msg = message ?? `警告：方法 ${className}[${propKeyStr}]() 被滥用`;
        const originMethod = propDesc.value;
        const resultFuncName = originMethod.name ?? "a";
        const result = {
            [resultFuncName]: function(){
                if (warning){
                    console.warn(msg);
                    warning = false;
                }
                return Reflect.apply(originMethod, this, arguments);
            }
        };
        propDesc.value = result[resultFuncName];
        return propDesc;
    }
}