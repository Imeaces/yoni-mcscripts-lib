import { World, world, YoniWorld } from "./world.js";
import { YoniEntityType } from "./entity/EntityTypeDefs.js";
import { EntityBase, YoniEntity, YoniPlayer, YoniSimulatedPlayer, Entity } from "./entity.js";
import { Block, YoniBlock } from "./block.js";
import { Dimension, YoniDimension } from "./dimension.js";
import { Minecraft, Gametest } from "./basis.js";

export class Yoni {
    static getVanilla(object: YoniEntityType): Minecraft.Entity;
    static getVanilla(object: YoniEntity): Minecraft.Entity;
    static getVanilla(object: YoniPlayer): Minecraft.Player;
    static getVanilla(object: YoniSimulatedPlayer): Gametest.SimulatedPlayer;
    static getVanilla(object: YoniDimension): Minecraft.Dimension;
    static getVanilla(object: YoniBlock): Minecraft.Block;
    static getVanilla(object: YoniWorld): Minecraft.World;
    static getVanilla(object: unknown): unknown {
        if (object instanceof Entity)
            return object.vanillaEntity;
        
        if (object instanceof Dimension)
            return object.vanillaDimension;
        
        if (object instanceof Block)
            return object.vanillaBlock;
        
        if (object instanceof World)
            return object.vanillaWorld;
            
    }
    
    static get(object: Minecraft.Entity): YoniEntity;
    static get(object: Minecraft.Player): YoniPlayer;
    static get(object: Gametest.SimulatedPlayer): YoniSimulatedPlayer;
    static get(object: Minecraft.Dimension): YoniDimension;
    static get(object: Minecraft.Block): YoniBlock;
    static get(object: Minecraft.World): YoniWorld;
    static get(object: unknown): unknown {
        if (object instanceof Minecraft.Entity || object instanceof Minecraft.Player || object instanceof Gametest.SimulatedPlayer)
            return EntityBase.from(object);
        
        if (object instanceof Minecraft.Dimension)
            return Dimension.toDimension(object);
        
        if (object instanceof Minecraft.Block)
            return Block.from(object);
        
        if (object instanceof Minecraft.World)
            return world;
    }
}