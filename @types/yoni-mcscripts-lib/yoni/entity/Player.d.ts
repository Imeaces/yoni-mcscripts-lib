import { Minecraft } from "../basis.js";
import { Entity } from "./Entity.js";
declare class Player extends Entity {
    get vanillaPlayer(): Minecraft.Player;
    get entityType(): Minecraft.EntityType;
    get inventory(): Minecraft.Container;
    get [Symbol.toStringTag](): string;
    /**
     * 玩家的经验等级。
     * @type {number}
     */
    get experienceLevel(): number;
    /**
     * 设置玩家的经验等级。
     * @param {number} level
     */
    setExperienceLevel(level: number): void;
    /**
     * 使玩家离开游戏，玩家将会看到他被服务器踢出游戏。
     * @param {string} [msg] - 踢出玩家时显示的消息。
     * @throws 若未能成功将玩家踢出游戏，抛出错误。
     */
    kick(msg?: string): Promise<void>;
    get gamemode(): Minecraft.GameMode;
    setGamemode(v: PlayerGameModeValue): void;
    removeXp(xpCount: number): void;
    applyImpulse(vector: Minecraft.Vector3): void;
}
declare type PlayerGameModeValue = Minecraft.GameMode | PlayerGameModeCode | PlayerGameModeId | "default";
declare type PlayerGameModeCode = 0 | 1 | 2;
declare type PlayerGameModeId = "creative" | "survival" | "adventure" | "spectator";
declare type YoniPlayer = Player & Minecraft.Player;
export default YoniPlayer;
export { YoniPlayer, Player };
