import Minecraft from "../../../minecraft.js";
import { EventRegistry } from "../EventRegistry.js";
import { EventSignalListeningAdapter } from "../adapter/EventSignalListeningAdapter.js";

const { world, system } = Minecraft;
const VanillaBeforeEvents = world.beforeEvents;
const VanillaAfterEvents = world.afterEvents;
const SystemBeforeEvents = system.beforeEvents;
const SystemAfterEvents = system.afterEvents;

const eventSignals = {
    "VanillaEvents": new Set(),
    "SystemEvents": new Set(),
}
for (const propKey in SystemAfterEvents){
    eventSignals.SystemEvents.add(SystemAfterEvents[propKey]);
}
for (const propKey in SystemBeforeEvents){
    eventSignals.SystemEvents.add(SystemBeforeEvents[propKey]);
}
for (const propKey in VanillaAfterEvents){
    eventSignals.VanillaEvents.add(VanillaAfterEvents[propKey]);
}
for (const propKey in VanillaBeforeEvents){
    eventSignals.VanillaEvents.add(VanillaBeforeEvents[propKey]);
}

const EventClasses = [];
for (const name in Minecraft){
    if (!name.endsWith("Event"))
        continue;
    
    const signalName = name + "Signal";
    const signalClass = Minecraft[signalName];
    const clazz = Minecraft[name];
    
    EventClasses.push([name, clazz, signalClass]);
}

const mappedEventInfos = [];

for (const eventClassEntry of EventClasses){
    const [name, eventClass, signalClass] = eventClassEntry;
    let prefixKey = null;
    let eventSignal = null;
    
    FindPrefixAndSignalCode:
    for (const prefix in eventSignals){
        for (const signal of eventSignals[prefix]){
            if (Object.getPrototypeOf(signal) === signalClass.prototype){
                eventSignal = signal;
                prefixKey = prefix;
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
