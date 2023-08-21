import { VanillaWorld, Minecraft, overworld, StatusCode, VanillaScoreboard } from "./basis.js";
import { EntityBase } from "./entity/EntityBase.js";
import { Command } from "./command.js";
import { Location } from "./Location.js";

export function teleportEntity(entity: Minecraft.Entity, location: Vector3, teleportOptions?: Minecraft.TeleportOptions){
    const { rotation, keepVelocity, facingLocation, dimension, checkForBlocks } = teleportOptions ?? {};
    
    if (checkForBlocks)
        throw new Error("not support checkForBlocks");
    
    let { velocity } = entity;
    let rx = rotation?.x ?? 0;
    let ry = rotation?.y ?? 0;
    
    entity.teleport(new Location(location).getVanillaLocation(), dimension ?? entity.dimension, rx, ry);
    
    let command = "tp @s ~ ~ ~";
    
    if (rotation){
    } else if (facingLocation){
        const { x, y, z } = facingLocation;
        command = Command.getCommand(command, "facing", x as any, y as any, z as any);
    }
    
    if (checkForBlocks)
        command = Command.getCommand(command, "true");
    
    Command.execute(entity, command);
    
    if (keepVelocity)
        entity.setVelocity(velocity);
}

export function isEntityValid(entity: any){
    return EntityBase.isAliveEntity(entity);
}

export function getEntity(world: Minecraft.World, id: string): Minecraft.Entity | undefined {
    throw new ReferenceError("not implemented");
}

let currentTick = -1;
VanillaWorld.events.tick.subscribe((event) => {
    currentTick = event.currentTick;
});

export function getCurrentTick(){
    return currentTick;
}

export function clearRun(taskId: number): void {
    const sid = runningSchedules.get(taskId);
    if (!sid) return;
    runningSchedules.delete(taskId);
    //@ts-ignore
    VanillaWorld.events.tick.unsubscribe(sid);
}

export function run(cb: () => void): number {
    const taskId = globalTaskId++;
    let sid = VanillaWorld.events.tick.subscribe(function run(event) {
        clearRun(taskId);
        cb();
    });
    runningSchedules.set(taskId, sid);
    return taskId;
}

export function runTimeout(cb: () => void, timeout: number = 0): number {
    const taskId = globalTaskId++;
    let nextRunAt = getCurrentTick() + timeout;
    let sid = VanillaWorld.events.tick.subscribe(function runInterval(event) {
        if (event.currentTick < nextRunAt){
           return;
        }
        clearRun(taskId);
        cb();
    });
    runningSchedules.set(taskId, sid);
    return taskId;
}

export function runInterval(cb: () => void, interval: number = 1): number {
    const taskId = globalTaskId++;
    let nextRunAt = getCurrentTick() + interval;
    let sid = VanillaWorld.events.tick.subscribe(function runInterval(event) {
        if (event.currentTick < nextRunAt){
           return;
        }
        nextRunAt = event.currentTick + (interval ?? 1);
        cb();
    });
    runningSchedules.set(taskId, sid);
    return taskId;
}

let globalTaskId = 0;
const runningSchedules = new Map<number, Function>();

export function setScore(objective: Minecraft.ScoreboardObjective, identity: Minecraft.Entity | string | Minecraft.ScoreboardIdentity, score: number){
    Objective.playerCommand(Scoreboard.getObjective(objective), "set", identity, score);
}

export function isObjectiveValid(objective: Minecraft.ScoreboardObjective | null | undefined): boolean {
    try {
        //@ts-ignore
        objective.id;
    } catch {
        return false;
    }
    return true;
}

export function addObjective(scoreboard: Minecraft.Scoreboard, objectiveId: string, displayName: string): Minecraft.ScoreboardObjective {
    Command.run(Command.getCommandMoreStrict("scoreboard objectives add", objectiveId, "dummy", displayName));
    return scoreboard.getObjective(objectiveId);
}

export function removeObjective(scoreboard: Minecraft.Scoreboard, objective: string | Minecraft.ScoreboardObjective): boolean {
    return Command.run(Command.getCommandMoreStrict("scoreboard objectives remove", typeof objective === "string" ? objective : objective.id)).successCount > 0;
}

import { Objective } from "./scoreboard/Objective.js";
import { Scoreboard, DisplaySlot } from "./scoreboard/Scoreboard.js";
import { EntryType } from "./scoreboard/EntryType.js";
export function removeParticipant(objective: Minecraft.ScoreboardObjective, identity: Minecraft.Entity | string | Minecraft.ScoreboardIdentity){
    return Objective.playerCommand(Scoreboard.getObjective(objective), "reset", identity);
}

export function hasParticipant(objective: Minecraft.ScoreboardObjective, identity: Minecraft.Entity | string | Minecraft.ScoreboardIdentity): boolean {
    let condition: (scbid: Minecraft.ScoreboardIdentity) => boolean;
    if (typeof identity === "string"){
        condition = (scbid) => ((scbid.type as any) === EntryType.FAKE_PLAYER && scbid.displayName === identity);
    } else {
        if (EntityBase.isMinecraftEntity(identity)){
            let entity = identity;
            if (entity.scoreboard == undefined)
                return false;
            else
                identity = entity.scoreboard;
        }
        condition = (scbid) => scbid === identity;
    }
    for (const participant of objective.getParticipants()){
        if (condition(participant)){
            return true;
        }
    }
    return false;
}

export function getObjectiveAtDisplaySlot(scoreboard: Minecraft.Scoreboard, slot: Minecraft.DisplaySlotId): Minecraft.ScoreboardObjectiveDisplayOptions {
    return { objective: null } as unknown as Minecraft.ScoreboardObjectiveDisplayOptions;
}

export function clearObjectiveAtDisplaySlot(scoreboard: Minecraft.Scoreboard, slot: Minecraft.DisplaySlotId): Minecraft.ScoreboardObjective {
    let { objective: last } = getObjectiveAtDisplaySlot(scoreboard, slot);
    Command.run(Command.getCommandMoreStrict("scoreboard objectives setdisplay", slot as unknown as string));
    return last;
}

export function setObjectiveAtDisplaySlot(scoreboard: Minecraft.Scoreboard, slot: Minecraft.DisplaySlotId, options: Minecraft.ScoreboardObjectiveDisplayOptions): Minecraft.ScoreboardObjective {
    let { objective: last } = getObjectiveAtDisplaySlot(scoreboard, slot);
    let command = Command.getCommandMoreStrict("scoreboard objectives setdisplay", slot as unknown as string, options.objective.id);
    if (options.sortOrder === 0){
        command = Command.getCommandMoreStrict(command, "ascending");
    } else {
        command = Command.getCommandMoreStrict(command, "descending");
    }
    Command.run(command);
    return last;
}

declare module "mojang-minecraft" {
    interface System {}
    interface DisplaySlotId {
        [key: string | symbol | number]: any
    }
    /**
     * @beta
     * Used for specifying a sort order for how to display an
     * objective and its list of participants.
     */
    enum ObjectiveSortOrder {
        /**
         * @beta
         * @remarks
         * Objective participant list is displayed in ascending (e.g.,
         * A-Z) order.
         *
         */
        Ascending = 0,
        /**
         * @beta
         * @remarks
         * Objective participant list is displayed in descending (e.g.,
         * Z-A) order.
         *
         */
        Descending = 1,
    }
    interface ScoreboardObjectiveDisplayOptions {
        /**
         * @remarks
         * Objective to be displayed.
         *
         */
        objective: ScoreboardObjective;
        /**
         * @remarks
         * The sort order to display the objective items within.
         *
         */
        sortOrder?: ObjectiveSortOrder;
    }
    interface SystemBeforeEvents {
    }
    interface SystemAfterEvents {
    }
    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }
    interface Vector2 {
        x: number;
        y: number;
    }
    interface TeleportOptions {
        /**
         * @remarks
         * Whether to check whether blocks will block the entity after
         * teleport.
         *
         */
        checkForBlocks?: boolean;
        /**
         * @remarks
         * Dimension to potentially move the entity to.  If not
         * specified, the entity is teleported within the dimension
         * that they reside.
         *
         */
        dimension?: Minecraft.Dimension;
        /**
         * @remarks
         * Location that the entity should be facing after teleport.
         *
         */
        facingLocation?: Vector3;
        /**
         * @remarks
         * Whether to retain the entities velocity after teleport.
         *
         */
        keepVelocity?: boolean;
        /**
         * @remarks
         * Rotation of the entity after teleport.
         *
         */
        rotation?: Vector2;
    }
    interface EntityEffectOptions {
        amplifier?: number
        showParticles?: boolean
    }
}

    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }
    interface Vector2 {
        x: number;
        y: number;
    }
