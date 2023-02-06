import { Player } from "./Player.js";
import { SimulatedPlayer } from "./SimulatedPlayer.js";
import { Entity } from "./Entity.js";
import { Minecraft, Gametest } from "../basis.js";
export declare type YoniEntityType = Entity | Player | SimulatedPlayer;
export declare type MinecraftEntityType = Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer;
export declare type EntityType = MinecraftEntityType | YoniEntityType;
