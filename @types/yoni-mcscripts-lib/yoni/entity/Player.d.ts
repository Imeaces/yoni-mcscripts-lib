import { Minecraft } from "../basis.js";
import { Entity } from "./Entity.js";
declare class Player extends Entity {
    #private;
    get entityType(): Minecraft.EntityType;
    get inventory(): any;
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
    setExperienceLevel(level: any): Promise<never[]>;
    /**
     * 踢出玩家
     * @param {string} [msg] - 踢出玩家时显示的消息
     */
    kick(msg: any): Promise<void>;
    /**
     * 向玩家发送消息
     * @param {string} message
     */
    sendMessage(message: any): Promise<unknown>;
    /**
     * 以原始json文本的形式给玩家发送消息
     * @param {Minecraft.IRawMessage} rawtext
     */
    sendRawMessage(rawtext: any): Promise<unknown>;
    get gamemode(): any;
    set gamemode(v: any);
}
export default Player;
export { Player };
