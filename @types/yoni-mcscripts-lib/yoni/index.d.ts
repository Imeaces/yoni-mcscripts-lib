import { EventTypes } from "./event.js";
import { EventListener } from "./event.js";
import { EventSignal } from "./event.js";
import { events } from "./event.js";
import { Scoreboard } from "./scoreboard.js";
import { Objective } from "./scoreboard/Objective.js";
import { Entry } from "./scoreboard/Entry.js";
import { World } from "./world.js";
import { dim } from "./basis.js";
import { Minecraft } from "./basis.js";
import { MinecraftGui } from "./basis.js";
import { Gametest } from "./basis.js";
import { VanillaWorld } from "./basis.js";
import { VanillaEvents } from "./basis.js";
import { VanillaScoreboard } from "./basis.js";
import { runTask } from "./basis.js";
import { Logger } from "./util/Logger.js";
import { log } from "./util/Logger.js";
import { console } from "./util/Logger.js";
import { Location } from "./Location.js";
import { YoniScheduler } from "./schedule.js";
import { Schedule } from "./schedule.js";
import { Command } from "./command.js";
import { ChatCommand } from "./util/ChatCommand.js";
import { EntityBase } from "./entity.js";
import { Player } from "./entity.js";
import { Entity } from "./entity.js";
import { SimulatedPlayer } from "./entity.js";
import { YoniEntity } from "./entity.js";
import { YoniPlayer } from "./entity.js";
import { YoniSimulatedPlayer } from "./entity.js";
export const Utils: {};
export namespace Yoni {
    export function isDebug(): boolean;
    export { injectGlobal };
    export { debug };
}
export namespace Vanilla {
    export { Minecraft };
    export { MinecraftGui };
    export { Gametest };
    export { VanillaWorld as world };
    export { VanillaEvents as EventTypes };
    export { VanillaScoreboard as Scoreboard };
}
import { injectGlobal } from "./config.js";
import { debug } from "./config.js";
export { EventTypes, EventListener, EventSignal, events, Scoreboard, Objective, Entry, World, dim, Minecraft, MinecraftGui, Gametest, VanillaWorld, VanillaEvents, VanillaScoreboard, runTask, Logger, log, console, Location, YoniScheduler, Schedule, Command, ChatCommand, EntityBase, Player, Entity, SimulatedPlayer, YoniEntity, YoniPlayer, YoniSimulatedPlayer };
