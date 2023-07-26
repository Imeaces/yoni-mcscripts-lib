export { EntityBase } from "./entity/EntityBase.js";
export { SimulatedPlayer, YoniSimulatedPlayer } from "./entity/SimulatedPlayer.js";
export { Player, YoniPlayer } from "./entity/Player.js";
export { Entity, YoniEntity } from "./entity/Entity.js";
export * from "./entity/EntityTypeDefs.js";

// to load entity class sync
import "./entity/Entity.js";
import "./entity/Player.js";
import "./entity/SimulatedPlayer.js";
