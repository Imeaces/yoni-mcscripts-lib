import { Minecraft } from "./modules/Minecraft.js";
export { Minecraft };
export { Gametest } from "./modules/Gametest.js";
export declare const VanillaWorld: Minecraft.World;
export declare const VanillaScoreboard: Minecraft.Scoreboard;
export declare const MinecraftSystem: Minecraft.System;
/**
 * @param {(...args: any[]) => void} callback
 * @param {...any} args
 */
export declare function runTask(callback: (...args: any[]) => void, ...args: any[]): void;
/**
 * overworld dimension
 * @type {Minecraft.Dimension}
 */
export declare const overworld: Minecraft.Dimension;
/**
 * a type contains a set of statusCode
 */
export declare enum StatusCode {
    fail = -2147483648,
    error = -2147483646,
    success = 0
}
