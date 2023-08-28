import { registerMinecraftEventOptionResolvers as reg1 } from "./EntityEventOptions.js";
import { registerMinecraftEventOptionResolvers as reg2 } from "./EntityDataDrivenTriggerEventOptions.js";

export function registerMinecraftEventOptionResolvers(){
    reg1();
    reg2();
}
