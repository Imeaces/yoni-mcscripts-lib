import { Minecraft } from "../../basis.js";
import { EventRegistry } from "../EventRegistry.js";
import { EventSignalListeningAdapter } from "../adapting/EventSignalListeningAdapter.js";
import IEventSignal from "../interfaces/IEventSignal";
import { logger } from "../logger.js";

const { world } = Minecraft;
const VanillaBeforeEvents = world.events;
const VanillaAfterEvents = world.events;
const SystemBeforeEvents: Minecraft.SystemBeforeEvents = {};
const SystemAfterEvents: Minecraft.SystemAfterEvents = {};

export function registerMinecraftNativeEvents(){

const eventSignals = {
    "VanillaEvents": new Set<IEventSignal>(),
    "SystemEvents": new Set<IEventSignal>(),
}
for (const propKey in SystemAfterEvents){
    //@ts-ignore
    eventSignals.SystemEvents.add(SystemAfterEvents[propKey]);
}
for (const propKey in SystemBeforeEvents){
    //@ts-ignore
    eventSignals.SystemEvents.add(SystemBeforeEvents[propKey]);
}
for (const propKey in VanillaAfterEvents){
    //@ts-ignore
    eventSignals.VanillaEvents.add(VanillaAfterEvents[propKey]);
}
for (const propKey in VanillaBeforeEvents){
    //@ts-ignore
    eventSignals.VanillaEvents.add(VanillaBeforeEvents[propKey]);
}

const NotAEventClassNames = [
    "BlockEvent",
    "MessageReceiveEvent"
];
const DefinedEventClassMappings = new Map<Function, Function>([
    [Minecraft.BeforeItemDefinitionTriggeredEvent, Minecraft.BeforeItemDefinitionEventSignal],
    [Minecraft.ItemDefinitionTriggeredEvent, Minecraft.ItemDefinitionEventSignal],
]);
   
const EventClasses: [string, Function, Function][] = [];
for (const name in Minecraft){
    if (!name.endsWith("Event") || NotAEventClassNames.includes(name))
        continue;
    
    const clazz = (Minecraft as any)[name];
    if (typeof clazz !== "function"){
        throw new TypeError("event "+name+" is not a function");
    }
    
    const signalName = name + "Signal";
    let signalClass = DefinedEventClassMappings.get(clazz) ?? (Minecraft as any)[signalName];
    if (typeof signalClass !== "function"){
        throw new TypeError("event signal "+signalName+" is not a function");
    }

    EventClasses.push([name, clazz, signalClass]);
}

const mappedEventInfos: { fullName: string, eventClass: Function, eventSignal: IEventSignal }[] = [];

for (const eventClassEntry of EventClasses){
    const [name, eventClass, signalClass] = eventClassEntry;
    let prefixKey = null;
    let eventSignal = null;
    
    FindPrefixAndSignalCode:
    for (const prefix in eventSignals){
        //@ts-ignore
        const signals: Set<EventSignal> = eventSignals[prefix];
        for (const signal of signals){
            if (Object.getPrototypeOf(signal) === signalClass.prototype){
                eventSignal = signal;
                prefixKey = prefix;
                signals.delete(signal);
                break FindPrefixAndSignalCode;
            }
        }
    }
    
    if (eventSignal === null){
        throw new TypeError("no match eventSignal for event: "+name);
    }
    
    const fullName = prefixKey + "." + name;
    const info = { fullName, eventClass, eventSignal };
    mappedEventInfos.push(info);
}

for (const info of mappedEventInfos){
    const { fullName, eventClass, eventSignal } = info;
    
    const adapter = new EventSignalListeningAdapter(eventSignal);
    const options = {
        displayName: fullName,
        extraOption: false, noExtends: true,
        listeningAdapter: adapter
    };
    EventRegistry.register(eventClass, options);
}

logger.trace("{} 个Minecraft事件已注册", mappedEventInfos.length);

}
