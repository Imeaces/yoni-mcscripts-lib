export type PlayerGameModeValue = Minecraft.GameMode | PlayerGameModeCode | PlayerGameModeId | "default"
export type PlayerGameModeCode = 0 | 1 | 2
export type PlayerGameModeId = "creative"|"survival"|"adventure"|"spectator"
import { Minecraft } from "../basis.js";
