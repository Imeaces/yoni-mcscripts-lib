import { VanillaWorld, Minecraft, overworld, StatusCode, VanillaScoreboard } from "./basis.js";
import { EntityBase } from "./entity/EntityBase.js";
import { Command } from "./command.js";

let currentTick = -1;
VanillaWorld.events.tick.subscribe((event) => {
    currentTick = event.currentTick;
});

export function getCurrentTick(){
    return currentTick;
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
export function removeParticipant(objective: Minecraft.ScoreboardObjective, identity: Minecraft.Entity | string | Minecraft.ScoreboardIdentity){
    return Objective.playerCommand(Scoreboard.getObjective(objective), "reset", identity);
}

export function hasParticipant(objective: Minecraft.ScoreboardObjective, identity: Minecraft.Entity | string | Minecraft.ScoreboardIdentity): boolean {
    let condition: (scbid: Minecraft.ScoreboardIdentity) => boolean;
    if (typeof identity === "string"){
        condition = (scbid) => scbid.type === EntryType.FAKE_PLAYER && scbid.displayName === identity;
    } else {
        if (EntityBase.isMinecraftEntity(identity)){
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
    Command.run(Command.getCommandMoreStrict("scoreboard objectives setdisplay", slot));
    return last;
}

export function setObjectiveAtDisplaySlot(scoreboard: Minecraft.Scoreboard, slot: Minecraft.DisplaySlotId, options: Minecraft.ScoreboardObjectiveDisplayOptions): Minecraft.ScoreboardObjective {
    let { objective: last } = getObjectiveAtDisplaySlot(scoreboard, slot);
    let command = Command.getCommandMoreStrict("scoreboard objectives setdisplay", slot, options.objective.id);
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
        [key: any]: any
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
}
