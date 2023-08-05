import { Gametest, Minecraft } from "../basis.js";
import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";
import { Player, YoniPlayer } from "./Player.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";

export class SimulatedPlayer extends Player {
    get [Symbol.toStringTag](): string {
        if (this instanceof SimulatedPlayer)
            return `SimulatedPlayer: { type: ${(this as unknown as YoniSimulatedPlayer).typeId} }`;
        return "Object (SimulatedPlayer)";
    }
}

/* 修补，或者说mixin？ */
copyPropertiesWithoutOverride(SimulatedPlayer.prototype, Gametest.SimulatedPlayer.prototype, "vanillaEntity");
/* 修复结束，除了没有类型 */

EntityClassRegistry.register(SimulatedPlayer, Gametest.SimulatedPlayer);

type BaseVanillaSimulatedPlayerClass = Omit<Omit<Gametest.SimulatedPlayer, keyof Minecraft.Player>, keyof SimulatedPlayer>;

export type YoniSimulatedPlayer = SimulatedPlayer & YoniPlayer & BaseVanillaSimulatedPlayerClass;
