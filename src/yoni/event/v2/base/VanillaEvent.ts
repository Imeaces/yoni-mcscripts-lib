import Minecraft from "../../../minecraft.js";
import { hasInstance } from "../../../lib/hasInstance.js";
import { Event } from "./Event.js";

export class VanillaEvent extends Event {
    static [Symbol.hasInstance](value: any){
        if (hasInstance(value, VanillaEvent))
            return true;
        
        return VanillaEvent.vanillaEventClassList.some(Class => value instanceof Class);
    }
    static vanillaEventClassList: Function[] = Object.getOwnPropertyNames(Minecraft)
        .filter(name => name.endsWith("Event") && typeof (Minecraft as any)[name] === "function")
        .map(name => (Minecraft as any)[name] as unknown as Function);
}
