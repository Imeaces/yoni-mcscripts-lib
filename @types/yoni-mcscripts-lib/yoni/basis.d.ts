import { Minecraft } from "./modules/Minecraft.js";
export { Minecraft };
export { MinecraftGui } from "./modules/MinecraftGui.js";
export { Gametest } from "./modules/Gametest.js";
export declare const VanillaWorld: Minecraft.World;
export declare const VanillaEvents: Minecraft.Events;
export declare const VanillaScoreboard: Minecraft.Scoreboard;
export declare const MinecraftSystem: Minecraft.System;
export declare const SystemEvents: Minecraft.SystemEvents;
/**
 * @param {(...args: any[]) => void} callback
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
export declare enum StatusCode {
    fail = -2147483648,
    error = -2147483646,
    success = 0
}
/**
 * 返回一个维度对象
 * @param dimid - something means a dimension
 * @returns dimension object
 */
declare function dim(dimid?: string | Minecraft.Dimension | number): Minecraft.Dimension;
declare namespace dim {
    var overworld: Minecraft.Dimension;
    var theEnd: Minecraft.Dimension;
    var nether: Minecraft.Dimension;
}
export { dim };
