import { Minecraft, Gametest } from "./basis.js";

import {
    YoniSimulatedPlayer,
    YoniPlayer,
    YoniEntity,
    SimulatedPlayer,
    Player,
    Entity
} from "./remix/entity/index.js";
export {
    YoniSimulatedPlayer,
    YoniPlayer,
    YoniEntity
}

export type YoniEntityValue = Entity | Player | SimulatedPlayer;

export type MinecraftEntityValue = 
    Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer

export type PlayerEntityValue = Minecraft.Player | Gametest.SimulatedPlayer | YoniPlayer | YoniSimulatedPlayer;

export type EntityValue = MinecraftEntityValue | YoniEntityValue;

export { DimensionLikeValue } from "./dimensionutils.js";
