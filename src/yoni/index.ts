import { WatchBird } from "./util/WatchBird.js";
WatchBird();

// vanilla module exports
export {
  Minecraft,
  Gametest,
} from "./basis.js";

// variable exports
export { world } from "./world.js";
export { system } from "./system.js";
export {
  runTask,
  dim,
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
export { EntityBase } from "./entity/EntityBase.js";
export { YoniScheduler } from "./schedule.js";
export { TPSCounter } from "./util/TPSCounter.js";
export { ObjectUtils } from "./lib/ObjectUtils.js";
export { Dimension } from "./dimension.js";
export { Block } from "./block.js";
export { Yoni } from "./Yoni.js";

// class exports
export { Schedule } from "./schedule.js";
export { Logger } from "./util/Logger.js";
export { Config } from "./util/Config.js";
export { Location } from "./Location.js";
export { UUID } from "./util/UUID.js";

// type exports
export {
    YoniEntity,
    YoniPlayer,
    YoniSimulatedPlayer,
} from "./entity.js";
export {
  Vector3
} from "./Location.js";
export { DimensionLikeValue } from "./dim.js";
export {
  Entry,
  Objective,
} from "./scoreboard.js";
export { YoniWorld } from "./world.js";
export { YoniDimension } from "./dimension.js";
export { YoniBlock } from "./block.js";

// enum
export { EntryType } from "./scoreboard.js";
export { CommandPriority } from "./command/CommandPriority.js";


//legacy event
export {
    Event,
    EventTypes,
    EventSignal,
    EventTrigger,
    EventTriggerBuilder,
    EventRegisterListener,
    EventListener,
    events
} from "./event.js";

// entity class
import {
    Entity,
    Player,
    SimulatedPlayer,
} from "./entity.js";
export const EntityClass = {
    Entity, 
    Player,
    SimulatedPlayer
};

