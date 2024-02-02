/**
 * 获取所有维度。
 */
export function getAllVanillaDimensions(): Minecraft.Dimension[] {
    const dimensions: Minecraft.Dimension[] = [];
    const names = Object.getOwnPropertyNames(Minecraft.MinecraftDimensionTypes) as (keyof Minecraft.MinecraftDimensionTypes)[];
    for (const dimensionEnumName of names){
        const dimensionId = Minecraft.MinecraftDimensionTypes[dimensionEnumName];
        const dimension = VanillaWorld.getDimension(dimensionId);
        dimensions.push(dimension);
    }
    return dimensions;
}

import { Minecraft, dim, VanillaWorld } from "./basis.js";

export const DimensionValues: Readonly<Record<string | number, Minecraft.Dimension>> = Object.freeze({
    "minecraft:nether": dim.nether,
    "nether": dim.nether,
    "-1": dim.nether,
    "minecraft:overworld": dim.overworld,
    "overworld": dim.overworld,
    "0": dim.overworld,
    "minecraft:the_end": dim.theEnd,
    "the_end": dim.theEnd,
    "the end": dim.theEnd,
    "theEnd": dim.theEnd,
    "1": dim.theEnd
});

/**
 * @param {any} value
 * @returns {Minecraft.Dimension}
 */
export function fromValueGetDimension(value: any): Minecraft.Dimension {
    if (value instanceof Minecraft.Dimension){
        return value;
    } else if (value in DimensionValues){
        return DimensionValues[value];
    } else {
        throw new Error("unknown dimension");
    }
}

import type { Dimension } from "./remix/dimension.js";
export type NetherDimensionLikeValue = -1 | 'minecraft:nether' | 'nether';
export type OverworldDimensionLikeValue = 0 | 'minecraft:overworld' | 'overworld';
export type TheEndDimensionLikeValue = 1 | 'minecraft:the_end' | 'the_end' | 'theEnd' | 'the end';
export type DimensionLikeValue =
    NetherDimensionLikeValue
    | OverworldDimensionLikeValue
    | TheEndDimensionLikeValue
    | Minecraft.Dimension
    | Dimension;
