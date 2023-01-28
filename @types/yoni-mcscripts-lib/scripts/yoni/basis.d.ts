import { Minecraft } from "./modules/Minecraft.js";
export { Minecraft };
export { MinecraftGui } from "./modules/MinecraftGui.js";
export { Gametest } from "./modules/Gametest.js";
/**
 * @borrows Minecraft.world as VanillaWorld
 */
export declare const VanillaWorld: Minecraft.World;
/**
 * @borrows Minecraft.world.events as VanillaEvents
 */
export declare const VanillaEvents: Minecraft.Events;
/**
 * @borrows Minecraft.world.scoreboard as VanillaScoreboard
 */
export declare const VanillaScoreboard: Minecraft.Scoreboard;
/**
 * @borrows Minecraft.system as MinecraftSystem
 */
export declare const MinecraftSystem: Minecraft.System;
/**
 * @borrows Minecraft.system.events as SystemEvents
 */
export declare const SystemEvents: Minecraft.SystemEvents;
/**
 * @param {(...args) => void} callback
 * @param {...any} args
 */
export declare const runTask: (callback: any, ...args: any[]) => void;
/**
 * overworld dimension
 * @type {Minecraft.Dimension}
 */
export declare const overworld: Minecraft.Dimension;
/**
 * a type contains a set of statusCode
 */
export declare class StatusCode {
    static fail: number;
    static error: number;
    static success: number;
}
/**
 * 返回一个维度对象
 * @param {string|Minecraft.Dimension|number} dimid - something means a dimension
 * @returns {Minecraft.Dimension} dimension objective
 */
declare let dim: (dimid?: number) => any;
export { dim };
