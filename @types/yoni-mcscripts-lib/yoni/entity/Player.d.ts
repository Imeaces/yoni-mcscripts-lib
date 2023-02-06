import { Minecraft } from "../basis.js";
import { Entity } from "./Entity.js";
declare class Player extends Entity {
    #private;
    get vanillaPlayer(): Minecraft.Player;
    get entityType(): Minecraft.EntityType;
    get inventory(): Minecraft.InventoryComponentContainer;
    get [Symbol.toStringTag](): string;
    get onScreenDisplay(): any;
    /**
     * 玩家的经验等级
     * @type {number}
     */
    get experienceLevel(): number;
    /**
     * 设置玩家的经验等级
     * @param {number} level
     */
    setExperienceLevel(level: any): void;
    /**
     * 使玩家离开游戏，玩家将会看到他被服务器踢出游戏。
     * @param {string} [msg] - 踢出玩家时显示的消息。
     * @throws 若未能成功将玩家踢出游戏，抛出错误。
     */
    kick(msg?: string): Promise<void>;
    /**
     * 向玩家发送消息
     * @param {string} message
     */
    sendMessage(message: string): void;
    get gamemode(): "creative" | "survival" | "adventure" | "spectator";
    set gamemode(v: 0 | 1 | 2 | "c" | "a" | "s" | "d" | "creative" | "survival" | "adventure" | "spectator" | "default");
}
declare type YoniPlayer = Player & Minecraft.Player;
export default YoniPlayer;
export { YoniPlayer as Player };
