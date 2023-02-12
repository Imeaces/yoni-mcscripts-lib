import YoniPlayer from "./Player.js";
import YoniSimulatedPlayer from "./SimulatedPlayer.js";
import YoniEntity from "./Entity.js";
import { Minecraft, Gametest } from "../basis.js";
export declare type YoniEntityType = YoniEntity | YoniPlayer | YoniSimulatedPlayer;
export declare type MinecraftEntityType = Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer;
export declare type EntityType = MinecraftEntityType | YoniEntityType;
