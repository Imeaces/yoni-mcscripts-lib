import { Gametest } from "../basis.js";
import { Player } from "./Player.js";
declare class SimulatedPlayer extends Player {
    get [Symbol.toStringTag](): string;
}
declare type YoniSimulatedPlayer = SimulatedPlayer & Gametest.SimulatedPlayer;
export default YoniSimulatedPlayer;
export { YoniSimulatedPlayer, SimulatedPlayer };
