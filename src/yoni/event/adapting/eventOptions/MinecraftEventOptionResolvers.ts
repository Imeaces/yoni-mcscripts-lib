import { registerMinecraftEventOptionResolvers as reg1 } from "./EntityEventOptions.js";
import { registerMinecraftEventOptionResolvers as reg2 } from "./EntityDataDrivenTriggerEventOptions.js";
import { registerMinecraftEventOptionResolvers as reg3 } from "./ScriptEventMessageFilterOptions.js";

export function registerMinecraftEventOptionResolvers(){
    reg1();
    reg2();
    reg3();
}
