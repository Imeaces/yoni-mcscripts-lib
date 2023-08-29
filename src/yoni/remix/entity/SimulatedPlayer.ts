import { Gametest, Minecraft } from "../../basis.js";
import { copyPropertiesWithoutOverride } from "../../lib/ObjectUtils.js";
import { Player } from "./Player.js";
import { EntityWraps } from "./EntityWraps.js";

class SimulatedPlayer extends Player {
    get [Symbol.toStringTag](): string {
        if (this instanceof SimulatedPlayer)
            return `SimulatedPlayer: { type: ${this.typeId} }`;
        return "Object (SimulatedPlayer)";
    }
}

/* 修补，或者说mixin？ */
copyPropertiesWithoutOverride(SimulatedPlayer.prototype, Gametest.SimulatedPlayer.prototype, "vanillaEntity");
/* 修复结束，除了没有类型 */

EntityWraps.registerWrap(SimulatedPlayer, Gametest.SimulatedPlayer);

type RemovedKeys = never
type OverridedKeys = never
type BaseVanillaSimulatedPlayerClass = 
    Omit<
        Omit<Gametest.SimulatedPlayer, keyof Minecraft.Entity | keyof Minecraft.Player>,
        RemovedKeys | OverridedKeys
    >;
interface SimulatedPlayer extends BaseVanillaSimulatedPlayerClass {
}

export { SimulatedPlayer, SimulatedPlayer as YoniSimulatedPlayer };
