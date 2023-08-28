import { PlayerGameModeValue } from "../../player/PlayerGameModeValue.js";

import {
    Minecraft,
    VanillaWorld, 
    StatusCode } from "../../basis.js";

import { dealWithCmd } from "../../commandutils.js";
import { Command } from "../../command.js";

import { copyPropertiesWithoutOverride } from "../../lib/ObjectUtils.js";
import { getNumber } from "../../lib/getNumber.js";

import { Entity } from "./Entity.js";
import { EntityUtils } from "../../EntityUtils.js";
import { EntityWraps } from "./EntityWraps.js";

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
            return `Player: { type: ${this.vanillaPlayer.typeId}, name: ${this.vanillaPlayer.name} }`;
        return "Object (Player)";
    }
    
    /**
     * 玩家的经验等级。
     * @type {number}
     */
    get experienceLevel(){
        return this.vanillaPlayer.level;
    }
    
    getItemInMainHand(): Minecraft.ItemStack | undefined {
        return EntityUtils.getItemInMainHand(this.vanillaPlayer);
    }

    setItemInMainHand(item?: Minecraft.ItemStack): void {
        return EntityUtils.setItemInMainHand(this.vanillaPlayer, item);
    }

    /**
     * 设置玩家的经验等级。
     * @param {number} level
     */
    setExperienceLevel(level: number){
        level = getNumber(level);
        if (this.vanillaPlayer.level !== level)
            this.addLevels(level - this.experienceLevel);
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
    
    get gamemode(): Minecraft.GameMode {
        // @ts-ignore
        for (let gm of Object.getOwnPropertyNames(Minecraft.GameMode).map(k=>Minecraft.GameMode[k])){
            for (let splayer of VanillaWorld.getPlayers({gameMode: gm})){
                if (EntityUtils.isSameEntity(splayer, this)){
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
    
    removeXp(xpCount: number){
        if (this.xpEarnedAtCurrentLevel >= xpCount){
            this.addExperience(-xpCount);
            return;
        }
  
        let v0 = this.xpEarnedAtCurrentLevel;
        xpCount -= v0;
        this.addExperience(-v0);
  
        while (xpCount > 0 && this.vanillaPlayer.level > 0){
            this.addLevels(-1);
            xpCount -= this.totalXpNeededForNextLevel;
        }
  
        if (xpCount < 0)
            this.addExperience(xpCount);
    }
}

copyPropertiesWithoutOverride(Player.prototype, Minecraft.Player.prototype, "vanillaEntity", ["level"]);

EntityWraps.registerWrap(Player, Minecraft.Player);

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
