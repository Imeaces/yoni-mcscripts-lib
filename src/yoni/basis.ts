import { Minecraft } from "./modules/Minecraft.js";
export { Minecraft }

export { Gametest } from "./modules/Gametest.js";

export const VanillaWorld: Minecraft.World = Minecraft.world;
export const VanillaScoreboard: Minecraft.Scoreboard = VanillaWorld.scoreboard;
export const MinecraftSystem: Minecraft.System = {};

/**
 * 在游戏刻的固定时机运行函数。
 */
export function runTask<P extends any[]>(callback: (...args: P) => any, ...args: P){
    if (args.length === 0)
        MinecraftSystem.run(callback);
    else
        MinecraftSystem.run(() => {
            callback(...args);
        });
}

/**
 * overworld dimension
 * @type {Minecraft.Dimension}
 */
export const overworld = VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.overworld);

/**
 * 返回当前是否为只读模式上下文（通常在before事件的回调执行时出现）。
 */
export function isReadonlyMode(): boolean {
    return false;
}

/**
 * 在上下文清空后立即运行函数。
 */
export function runImmediate<P extends any[]>(func: (...args: P) => any, ...args: P): void {
    runImmediate.run(func, args);
}

runImmediate.run = async function run<P extends any[]>(func: (...args: P) => any, args: P){
    await void 0; //pause func
    func(...args);
}

/**
 * a type contains a set of statusCode
 */
export enum StatusCode {
    fail = -2147483648,
    error = -2147483646,
    success = 0,
}

/**
 * 返回一个维度对象
 * @param dimid - something means a dimension
 * @returns dimension object
 */
function dim(dimid: string|Minecraft.Dimension|number = 0): Minecraft.Dimension{
    if (dimid instanceof Minecraft.Dimension) return dimid;
    switch (dimid) {
        case 0:
        case "overworld":
        case Minecraft.MinecraftDimensionTypes.overworld:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.overworld);
        case -1:
        case "nether":
        case Minecraft.MinecraftDimensionTypes.nether:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.nether);
        case 1:
        case "the end":
        case "theEnd":
        case "the_end":
        case Minecraft.MinecraftDimensionTypes.theEnd:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.theEnd);
        default:
            try {
                return VanillaWorld.getDimension(dimid as any);
            } catch {
                return dim(0);
            }
    }
}

/*
 * 主世界
 * @type {Minecraft.Dimension}
 */
dim.overworld = dim(0);

/*
 * 末地
 * @type {Minecraft.Dimension}
 */
dim.theEnd = dim(1);

/*
 * 下界
 * @type {Minecraft.Dimension}
 */
dim.nether = dim(-1);

export { dim };
