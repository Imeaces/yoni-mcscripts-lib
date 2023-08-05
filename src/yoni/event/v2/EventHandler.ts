//@ts-nocheck 不是目前工作的重点

const handlerList = new WeakMap<Object, Function[]>();
const eventHandlerList = new WeakMap<Object, Function[]>();

function getEventClass(): Object {
}

export function EventHandler(handlingEvent: string | Object): MethodDecorator {
    let eventClass = getEventClass(handlingEvent);
    
    function addEventHandler<T>(target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>): void {
        let handlers: Function[] = handlerList.get(target) ?? [];
        handlers.push(descriptor.value);
        handlerList.set(target, handlers);
        
        
        let eventHandlers: Function[] = eventHandlerList.get(eventClass) ?? [];
        eventHandlers.push(descriptor.value);
        eventHandlerList.set(eventClass, eventHandlers);
    }
    return addEventHandler;
}

function getHandlerList(object: Object): Function[] | undefined {
    return handlerList.get(target);
}
function getEventHandlerList(event: Object): Function[] | undefined {
    return eventHandlerList.get(target);
}
/*
target: Object,
event: string | EventClass){
    let hasBeenWarned = false;
    return function warnAbuseMessageAndContinue(target: any, propKey: string | symbol | number, propDesc: PropertyDescriptor){
        if (hasBeenWarned)
            return;
        
        const propKeyStr = String(propKey);
        hasBeenWarned = true;
        if (message){
            console.warning(message);
        } else if (typeof propDesc.value === "function"){
            console.warning(`警告：方法 ${target.constructor.name}[${propKeyStr}]() 被滥用`);
        } else {
            console.warning(`警告：${target.constructor.name}[${propKeyStr}] 被滥用`);
        }
    }
}


/*
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
*/
