export * from "./scoreboard/Objective.js";
export * from "./scoreboard/EntryType.js";
export * from "./scoreboard/ScoreboardEntry.js";
export * from "./scoreboard/ScoreboardError.js";
export * from "./scoreboard/Scoreboard.js";

//兼容
import { Scoreboard } from "./scoreboard/Scoreboard.js";
export { Scoreboard as SimpleScoreboard };
