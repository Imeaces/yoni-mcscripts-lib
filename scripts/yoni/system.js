import { MinecraftSystem, VanillaEvents, runTask } from "./basis.js";
import { assignAllPropertiesWithoutOverride } from "./lib/ObjectUtils.js";
const system = {};
assignAllPropertiesWithoutOverride(system, MinecraftSystem);
if (!system.currentTick) {
    let currentTick = -1;
    VanillaEvents.tick.subscribe((event) => {
        currentTick = event.currentTick;
    });
    Object.defineProperties(system, {
        currentTick: {
            configurable: true,
            get() {
                return currentTick;
            },
        }
    });
}
if (!system.run) {
    Object.defineProperties(system, {
        run: {
            configurable: true,
            value: runTask
        },
    });
}
export { system };
export default system;
