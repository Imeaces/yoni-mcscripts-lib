import { registerMinecraftNativeEvents as reg1 } from "./lib/eventRegistration.js";
import { registerMinecraftEventOptionResolvers as reg2 } from "./adapting/eventOptions/EntityEventOptions.js";
import { registerMinecraftEventOptionResolvers as reg3 } from "./adapting/eventOptions/EntityDataDrivenTriggerEventOptions.js";
reg1();
reg2();
reg3();
