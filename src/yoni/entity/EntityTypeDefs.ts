import { Minecraft, Gametest } from "../basis.js";

import { SimulatedPlayer, YoniSimulatedPlayer } from "./SimulatedPlayer.js";
import { Player, YoniPlayer } from "./Player.js";
import { Entity, YoniEntity } from "./Entity.js";
import { EntityBase } from "./EntityBase.js";

export type YoniEntityType = YoniEntity | YoniPlayer | YoniSimulatedPlayer;
export type YoniEntityValue = EntityBase | Entity | Player | SimulatedPlayer;

export type MinecraftEntityValue = 
    Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer

export type EntityValue = MinecraftEntityValue | YoniEntityType;
