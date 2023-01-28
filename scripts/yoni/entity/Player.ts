// @ts-nocheck
import {
    Minecraft,
    VanillaWorld, 
    StatusCode } from "../basis.js";
import { dealWithCmd } from "../lib/utils.js";
import { Command } from "../command.js";
import { PlayerOnScreenDisplay } from "./player/PlayerOnScreenDisplay.js";
import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";
import { getNumber } from "../lib/getNumber.js";
import { Entity } from "./Entity.js";
import { EntityBase } from "./EntityBase.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";

const { MinecraftEntityTypes } = Minecraft;

class Player extends Entity {
    get entityType(){
        return MinecraftEntityTypes.player;
    }
    
    get inventory(){
        return EntityBase.getInventory(this);
    }
    
    get [Symbol.toStringTag](){
        if (this instanceof Player)
            return `Player: { type: ${this.typeId}, name: ${this.name} }`;
        return "Object (Player)";
    }
    
    #onScreenDisplay = null;
    get onScreenDisplay(){
        if (this.vanillaEntity.onScreenDisplay){
            return this.vanillaEntity.onScreenDisplay;
        }
        if (this.#onScreenDisplay === null){
            this.#onScreenDisplay = new PlayerOnScreenDisplay(this);
        }
        return this.#onScreenDisplay;
    }
    
    /**
     * 玩家的经验等级
     * @type {number}
     */
    get experienceLevel(){
        let level = 0;
        for (let i = 16384; i >= 1; i /= 2){
            level += i;
            let rt = VanillaWorld.getPlayers({ minLevel: level });
            if ( ! Array.from( rt ).includes( this.vanillaEntity ) )
            {
                level -= i;
            }
        }
        return level;
    }
    
    /**
     * 设置玩家的经验等级
     * @param {number} level
     */
    setExperienceLevel(level){
        level = getNumber(level);
        return Command.postExecute([
            Command.addExecute(Command.PRIORITY_HIGH, this, "xp -24791l @s"),
            Command.addExecute(Command.PRIORITY_HIGH, this, `xp ${level}l @s`)
        ]);
    }
    
    /**
     * 踢出玩家
     * @param {string} [msg] - 踢出玩家时显示的消息
     */
    async kick(msg){
        let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "kick", this.name, msg);
        if (rt.statusCode !== StatusCode.success){
            throw new Error(rt.statusMessage);
        }
    }
    
    /**
     * 向玩家发送消息
     * @param {string} message
     */
    sendMessage(message){
        let rawtext = { rawtext: [{ text: String(message) }] };
        return this.sendRawMessage(rawtext);
    }
    
    /**
     * 以原始json文本的形式给玩家发送消息
     * @param {Minecraft.IRawMessage} rawtext 
     */
    sendRawMessage(rawtext){
        let command = "tellraw @s " + JSON.stringify(rawtext, dealWithCmd);
        return Command.addExecute(Command.PRIORITY_HIGH, this, command);
    }
     
    get gamemode(){
        for (let gm of Object.getOwnPropertyNames(Minecraft.GameMode).map(k=>Minecraft.GameMode[k])){
            for (let player of VanillaWorld.getPlayers({gamemode: gm})){
                if (EntityBase.isSameEntity(this, player)){
                    return gm;
                }
            }
        }
        throw new Error("unknown gamemode");
    }
    set gamemode(v){
        let command = `gamemode ${v} @s`;
        return Command.addExecute(Command.PRIORITY_HIGHEST, this, command);
    }
}

/* 修补 */
copyPropertiesWithoutOverride(Player.prototype, Minecraft.Player.prototype, "vanillaEntity");
/*修复结束*/

EntityClassRegistry.register(Player, Minecraft.Player);

export default Player;
export { Player };
