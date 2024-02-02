"use strict";


class a {
    @MethodAbuseWarning()
    on(){
    }
}

function test(){
console.log("start");
console.log("1");
let s = new a();
console.log("2");
s.on();
console.log("3");
s.on();
s.on();
s.on();
s.on();
s.on();
s=new a();
s.on();
s.on();
s.on();
s.on();
s.on();
s.on();
s.on();
s.on();
console.log("end");
}
function MethodAbuseWarning(message?: string): MethodDecorator {
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
                    console.log("WARN: "+msg);
                    warning = false;
                }
                return Reflect.apply(originMethod, this, arguments);
            }
        };
        propDesc.value = result[resultFuncName];
        return propDesc;
    }
}

test();