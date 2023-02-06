import { Minecraft } from "./basis.js";
interface SystemClass {
    run(func: () => void): void;
    currentTick: number;
    events: Minecraft.SystemEvents;
}
declare const system: SystemClass;
export { system };
export default system;
