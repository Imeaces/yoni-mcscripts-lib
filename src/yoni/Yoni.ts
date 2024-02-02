import { World, world, YoniWorld } from "./remix/world.js";
import { YoniEntityValue, YoniEntity, YoniPlayer, YoniSimulatedPlayer } from "./types";
import { EntityUtils } from "./EntityUtils.js";
import { YoniDimension } from "./remix/dimension.js";
import { Minecraft, Gametest, VanillaScoreboard } from "./basis.js";
import { ScoreboardEntry, Objective, Scoreboard } from "./scoreboard.js";

/**
 * 这个类上的方法用于将各种对象在原始对象与映射对象之间转换。
 */
export class Yoni {
    static getVanilla(object: YoniEntityValue): Minecraft.Entity;
    static getVanilla(object: YoniEntity): Minecraft.Entity;
    static getVanilla(object: YoniPlayer): Minecraft.Player;
    static getVanilla(object: YoniSimulatedPlayer): Gametest.SimulatedPlayer;
    static getVanilla(object: YoniDimension): Minecraft.Dimension;
    static getVanilla(object: YoniWorld): Minecraft.World;
    static getVanilla(object: ScoreboardEntry): Minecraft.ScoreboardIdentity;
    static getVanilla(object: Objective): Minecraft.ScoreboardObjective;
    static getVanilla(object: typeof Scoreboard): Minecraft.Scoreboard;
    static getVanilla(object: YoniEntityValue | YoniWorld | ScoreboardEntry | Objective | typeof Scoreboard): Minecraft.Entity | Minecraft.Dimension | Minecraft.World | Minecraft.ScoreboardIdentity | Minecraft.ScoreboardObjective | Minecraft.Scoreboard;
    static getVanilla(object: unknown): unknown {
        if (object instanceof YoniEntity)
            return object.vanillaEntity;
        
        if (object instanceof YoniDimension)
            return object.vanillaDimension;
        
        if (object instanceof YoniWorld)
            return object.vanillaWorld;
            
        if (object instanceof ScoreboardEntry){
            const identity = object.vanillaScoreboardIdentity;
            if (identity)
                return identity;
            else
                throw new ReferenceError("could not find the relative Minecraft.ScoreboardIdentity");
        }
        
        if (object instanceof Objective)
            return object.vanillaObjective;
        
        if (object === Scoreboard)
            return VanillaScoreboard;
        
    }
    
    static get(object: Minecraft.Entity): YoniEntity;
    static get(object: Minecraft.Player): YoniPlayer;
    static get(object: Gametest.SimulatedPlayer): YoniSimulatedPlayer;
    static get(object: Minecraft.Dimension): YoniDimension;
    static get(object: Minecraft.World): YoniWorld;
    static get(object: Minecraft.ScoreboardIdentity): ScoreboardEntry;
    static get(object: Minecraft.ScoreboardObjective): Objective;
    static get(object: Minecraft.Scoreboard): typeof Scoreboard;
    static get(object: unknown): unknown {
        if (object instanceof Minecraft.Entity || object instanceof Minecraft.Player || object instanceof Gametest.SimulatedPlayer)
            return EntityUtils.from(object);
        
        if (object instanceof Minecraft.Dimension)
            return YoniDimension.toDimension(object);
        
        if (object instanceof Minecraft.World)
            return world;

        if (object instanceof Minecraft.ScoreboardIdentity)
            return ScoreboardEntry.getEntry(object.type as any, object);
        
        if (object instanceof Minecraft.ScoreboardObjective)
            return Scoreboard.getObjective(object.id);
        
        if (object instanceof Minecraft.Scoreboard)
            return Scoreboard;
    }
}