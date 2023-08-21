import { PlayerGameModeValue } from "../player/PlayerGameModeValue.js";

import {
    Minecraft,
    VanillaWorld, 
    StatusCode } from "../basis.js";

import { dealWithCmd } from "../lib/commandutils.js";
import { Command } from "../command.js";

import { copyPropertiesWithoutOverride } from "../lib/ObjectUtils.js";
import { getNumber } from "../lib/getNumber.js";

import { Entity, YoniEntity } from "./Entity.js";
import { EntityBase } from "./EntityBase.js";
import { EntityClassRegistry } from "./EntityClassRegistry.js";

const { MinecraftEntityTypes } = Minecraft;

class Player extends Entity {
    
    get vanillaPlayer(): Minecraft.Player {
        return this.vanillaEntity as unknown as Minecraft.Player;
    }
    
    get entityType(){
        return MinecraftEntityTypes.player;
    }
    
    get [Symbol.toStringTag](){
        if (this instanceof Player)
            return `Player: { type: ${this.typeId}, name: ${this.vanillaPlayer.name} }`;
        return "Object (Player)";
    }
    
    /**
     * 玩家的经验等级。
     * @type {number}
     */
    get experienceLevel(){
        let level = 0;
        for (let addLevels = 32768; addLevels >= 1; addLevels /= 2){
            if (EntityBase.getWorldVanillaPlayers({minLevel: level+addLevels}).includes(this.vanillaPlayer)){
                level += addLevels;
            }
        }
        return level;
    }
    
    getItemInMainHand(): Minecraft.ItemStack | undefined {
        return EntityBase.getItemInMainHand(this.vanillaPlayer);
    }

    setItemInMainHand(item?: Minecraft.ItemStack): void {
        return EntityBase.setItemInMainHand(this.vanillaPlayer, item);
    }

    /**
     * 设置玩家的经验等级。
     * @param {number} level
     */
    setExperienceLevel(level: number){
        level = getNumber(level);
        if (this.experienceLevel !== level)
            this.addLevels(level - this.experienceLevel);
    }
    
    addLevels(level: number){
        level = parseInt(String(level));
        if (isNaN(level))
            throw new TypeError("not an integer");
        Command.execute(this, `xp ${level}l`);
    }
    
    /**
     * 使玩家离开游戏，玩家将会看到他被服务器踢出游戏。
     * @param {string} [msg] - 踢出玩家时显示的消息。
     * @throws 若未能成功将玩家踢出游戏，抛出错误。
     */
    async kick(msg?: string){
        let rt: any = null;
        
        if (msg)
            rt = await Command.addParams(Command.PRIORITY_HIGHEST, "kick", this.name, msg);
        else
            rt = await Command.addParams(Command.PRIORITY_HIGHEST, "kick", this.name);
        
        if (rt?.statusCode !== StatusCode.success){
            throw new Error(rt.statusMessage);
        }
    }
    
    sendChatMessage(msg: string){
        let rawtext = JSON.stringify({rawtext:[{text: msg}]}, dealWithCmd);
        Command.addExecute(Command.PRIORITY_HIGH, this.vanillaPlayer, `tellraw @s ${rawtext}`);
    }
    
    /**
     * 向玩家发送消息。
     */
    sendMessage(message: string){
        this.sendChatMessage(message);
    }
    
    get gamemode(): Minecraft.GameMode {
        // @ts-ignore
        for (let gm of Object.getOwnPropertyNames(Minecraft.GameMode).map(k=>Minecraft.GameMode[k])){
            for (let splayer of EntityBase.getWorldVanillaPlayers({gameMode: gm})){
                if (EntityBase.isSameEntity(splayer, this)){
                    return gm;
                }
            }
        }
        throw new Error("unknown gamemode");
    }
    setGamemode(gamemode: PlayerGameModeValue){
        let command = `gamemode ${gamemode as {}} @s`;
        Command.addExecute(Command.PRIORITY_HIGHEST, this, command);
    }
    
    totalXpNeededForNextLevel = 0;
    xpEarnedAtCurrentLevel = 0;
    addExperience(xp: number): boolean {
        xp = parseInt(String(xp));
        if (isNaN(xp))
            throw new TypeError("not an integer");
        Command.execute(this, `xp ${xp}`);
        return true;
    }
    
    removeXp(xpCount: number){
        if (this.xpEarnedAtCurrentLevel >= xpCount){
            this.addExperience(-xpCount);
            return;
        }
  
        let v0 = this.xpEarnedAtCurrentLevel;
        xpCount -= v0;
        this.addExperience(-v0);
  
        while (xpCount > 0 && this.experienceLevel > 0){
            this.addLevels(-1);
            xpCount -= this.totalXpNeededForNextLevel;
        }
  
        if (xpCount < 0)
            this.addExperience(xpCount);
    }
}

copyPropertiesWithoutOverride(Player.prototype, Minecraft.Player.prototype, "vanillaEntity", ["level"]);
EntityClassRegistry.register(Player, Minecraft.Player);

type RemovedKeys = "level"
type OverridedKeys = never
type BaseVanillaPlayerClass = 
    Omit<
        Omit<Minecraft.Player, keyof Minecraft.Entity>,
        RemovedKeys | OverridedKeys
    >;
interface Player extends BaseVanillaPlayerClass {
}

export { Player, Player as YoniPlayer };
