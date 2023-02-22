/**
 * @param {any} value
 * @returns {Minecraft.Dimension}
 */
export function fromValueGetDimension(value: any): Minecraft.Dimension;
/**
 * @returns {Minecraft.Dimension[]}
 */
export function getAllDims(): Minecraft.Dimension[];
export const DimensionValues: Readonly<{
    "minecraft:nether": Minecraft.Dimension;
    nether: Minecraft.Dimension;
    "-1": Minecraft.Dimension;
    "minecraft:overworld": Minecraft.Dimension;
    overworld: Minecraft.Dimension;
    "0": Minecraft.Dimension;
    "minecraft:the_end": Minecraft.Dimension;
    the_end: Minecraft.Dimension;
    "the end": Minecraft.Dimension;
    theEnd: Minecraft.Dimension;
    "1": Minecraft.Dimension;
}>;
import { Minecraft } from "./basis.js";
