import { Minecraft } from "../../../basis.js";
import { EventRegistry } from "../../EventRegistry.js";

export interface ScriptEventMessageFilterOptions extends Minecraft.ScriptEventMessageFilterOptions {
}

export function conditionScriptEventMessageFilterOptions(namespaces: string[], options: ScriptEventMessageFilterOptions): boolean {
    for (const namespace of namespaces){
        if (options.namespaces.includes(namespace))
            return true;
    }
    return false;
}


export function registerMinecraftEventOptionResolvers(){
(function (){
let registry = EventRegistry.getRegistry(Minecraft.ScriptEventCommandMessageAfterEvent);

registry.extraOption = true;
registry.extraOptionResolver = (event, options) => {
    const { id } = event;
    let namespace = "";
    for (const c of id){
        if (c !== ":")
            namespace += c;
    }
    return conditionScriptEventMessageFilterOptions([namespace], options);
}

})();

}