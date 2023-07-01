import { Gametest } from "../basis.js";
import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";
import { Player } from "./Player.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";

class SimulatedPlayer extends Player {
    get [Symbol.toStringTag](){
        if (this instanceof SimulatedPlayer)
            return `SimulatedPlayer: { type: ${this.typeId} }`;
        return "Object (SimulatedPlayer)";
    }
}

/* 修补，或者说mixin？ */
copyPropertiesWithoutOverride(SimulatedPlayer.prototype, Gametest.SimulatedPlayer.prototype, "vanillaEntity");
/* 修复结束，除了没有类型 */

EntityClassRegistry.register(SimulatedPlayer, Gametest.SimulatedPlayer);

// 导出类型
type YoniSimulatedPlayer = SimulatedPlayer & Gametest.SimulatedPlayer;

export default YoniSimulatedPlayer;
export { YoniSimulatedPlayer, SimulatedPlayer };
