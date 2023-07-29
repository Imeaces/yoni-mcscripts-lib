import Minecraft from "../../minecraft.js";
import { hasInstance } from "../../lib/hasInstance.js";

export class VanillaEvent extends Event {
    static [Symbol.hasInstance](value: any){
        if (hasInstance(value, VanillaEvent))
            return true;
        
        return VanillaEvent.vanillaEventClassList.some(Class => value instanceof Class);
    }
    //@ts-ignore
    static vanillaEventClassList: Function[] = Object.getOwnPropertyNames(Minecraft).filter(name => name.endsWith("Event") && typeof Minecraft[name] === "function").map(name => Minecraft[name]);
}
