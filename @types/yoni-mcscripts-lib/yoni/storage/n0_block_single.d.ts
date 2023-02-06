export class single_block {
    static get [Symbol.species](): ArrayConstructor;
    /**
     * @param {Objective|Minecraft.ScoreboardObjective|string} objective - 记分项
     */
    constructor(objective: Objective | Minecraft.ScoreboardObjective | string);
}
import Objective from "../scoreboard/SimpleScoreboard.js";
