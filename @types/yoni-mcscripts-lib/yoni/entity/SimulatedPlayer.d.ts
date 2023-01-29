import { Player } from "./Player.js";
declare class SimulatedPlayer extends Player {
    get [Symbol.toStringTag](): string;
}
export default SimulatedPlayer;
export { SimulatedPlayer };
