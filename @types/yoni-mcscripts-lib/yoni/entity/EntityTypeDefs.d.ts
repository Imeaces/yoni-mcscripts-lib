import { YoniPlayer, Player } from "./Player.js";
import { YoniSimulatedPlayer, SimulatedPlayer } from "./SimulatedPlayer.js";
import { YoniEntity, Entity } from "./Entity.js";
import { Minecraft, Gametest } from "../basis.js";
export declare type YoniEntityValue = YoniEntity | YoniPlayer | YoniSimulatedPlayer | Entity | Player | SimulatedPlayer;
export declare type MinecraftEntityValue = Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer;
export declare type EntityValue = MinecraftEntityValue | YoniEntityValue;
