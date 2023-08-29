import { WatchBird } from "./util/WatchBird.js";
WatchBird();

// vanilla module exports
export {
  Minecraft,
  Gametest,
} from "./basis.js";

// variable exports
export { world } from "./remix/world.js";
export { system } from "./system.js";
export {
  runTask,
  dim,
  runImmediate,
  isReadonlyMode,
  VanillaWorld,
  VanillaScoreboard,
  MinecraftSystem,
} from "./basis.js";
export { 
  log,
  console,
  print,
} from "./util/Logger.js";

// static field exports
export * as YoniUtils from "./utils.js";
export { Command } from "./command.js";
export { Scoreboard } from "./scoreboard.js";
export { ChatCommand } from "./command/ChatCommand.js";
export { EntityUtils, EntityUtils as EntityBase } from "./EntityUtils.js";
export { YoniScheduler } from "./schedule.js";
export { TPSCounter } from "./util/TPSCounter.js";
export { ObjectUtils } from "./lib/ObjectUtils.js";
export { Dimension } from "./remix/dimension.js";
export { Yoni } from "./Yoni.js";

// lib exports
export * as TimeoutLib from "./lib/Timeout.js";

// class exports
export { Schedule } from "./schedule.js";
export { Logger } from "./util/Logger.js";
export { Config } from "./lib/Config.js";
export { Location } from "./remix/Location.js";
export { UUID } from "./lib/UUID.js";

// type exports
export {
    YoniEntity,
    YoniPlayer,
    YoniSimulatedPlayer,
} from "./remix/entity/index.js";
export {
  Vector3
} from "./remix/Location.js";
export { DimensionLikeValue } from "./dimensionutils.js";
export {
  ScoreboardEntry,
  Objective,
} from "./scoreboard.js";
export { YoniWorld } from "./remix/world.js";
export { YoniDimension } from "./remix/dimension.js";

// enum
export { EntryType, DisplaySlot, ObjectiveSortOrder } from "./scoreboard.js";
export { CommandPriority } from "./command/CommandPriority.js";

export * from "./legacy_event.js";

//event
export * from "./event.js";

// entity class
import {
    Entity,
    Player,
    SimulatedPlayer,
} from "./remix/entity/index.js";
export const EntityClass = {
    Entity, 
    Player,
    SimulatedPlayer
};

/**
 * 加载用于debug的$eval命令，可以执行js代码（使用{#link eval}）
 */
export async function initializeDebugFunc(){
    await import("./debug_func.js");
}

export { ItemCreator } from "./item/ItemCreator.js";
