/**
 * @see {@link Minecraft.world}
 */
export const VanillaWorld: Minecraft.World;
/**
 * @see {@link Minecraft.world.events}
 */
export const VanillaEvents: any;
/**
 * @see {@link Minecraft.world.scoreboard}
 */
export const VanillaScoreboard: any;
/**
 * @see {@link Minecraft.system}
 */
export const MinecraftSystem: Minecraft.System;
/**
 * @see {@link Minecraft.system.events}
 */
export const SystemEvents: any;
export function runTask(callback: () => void): void;
/**
 * overworld dimension
 */
export const overworld: Minecraft.Dimension;
/**
 * a type contains a set of statusCode
 */
export class StatusCode {
    static fail: number;
    static error: number;
    static success: number;
}
import * as Minecraft from "@minecraft/server";
/**
 *
 * @param {string|Minecraft.Dimension|number} dimid - something means a dimension
 * @returns {Minecraft.Dimension} dimension objective
 */
export function dim(dimid?: string | Minecraft.Dimension | number): Minecraft.Dimension;
export namespace dim {
    const overworld: Minecraft.Dimension;
    const theEnd: Minecraft.Dimension;
    const nether: Minecraft.Dimension;
}
export { Gametest, MinecraftGui, Minecraft };
