//@ts-nocheck

import { Minecraft, dim, VanillaWorld } from "./basis.js";
import { getKeys } from "./lib/ObjectUtils.js";

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
export function fromValueGetDimension(value){
    if (value instanceof Minecraft.Dimension){
        return value;
    } else if (value in DimensionValues){
        return DimensionValues[value];
    } else {
        throw new Error("unknown dimension");
    }
}

/**
 * @returns {Minecraft.Dimension[]}
 */
export function getAllDims(){ 
    return [dim(0), dim(1), dim(-1)];
}

import { Dimension } from "./dimension.js";
export type NetherDimensionLikeValue = -1 | 'minecraft:nether' | 'nether';
export type OverworldDimensionLikeValue = 0 | 'minecraft:overworld' | 'overworld';
export type TheEndDimensionLikeValue = 1 | 'minecraft:the_end' | 'the_end' | 'theEnd' | 'the end';
export type DimensionLikeValue =
    NetherDimensionLikeValue
    | OverworldDimensionLikeValue
    | TheEndDimensionLikeValue
    | Minecraft.Dimension
    | Dimension;
