import ChatCommand from "scripts/yoni/command/ChatCommand.js";
import { VanillaWorld, runCmd, VanillaScoreboard } from "scripts/yoni/basis.js";
import { say } from "scripts/yoni/util/yoni-lib.js";
import SimpleScoreboard from "scripts/yoni/scoreboard/SimpleScoreboard.js";
import Entry from "scripts/yoni/scoreboard/Entry.js";
//import { Listener } from "scripts/yoni/Listener.js";
import { Player as VanillaEntity } from "mojang-minecraft";

class TestCommandExecutor {
    onCommand(sender, rawCommand, label, args){
let obj = SimpleScoreboard.getObjective("species");
let pl;
Array.from(VanillaWorld.getPlayers()).forEach((p) => {pl = p});
obj.setScore(pl, 2695);
    }
}

class Test2CommandExecutor {
    onCommand(sender, rawCommand, label, args){
let obj = SimpleScoreboard.getObjective("species");
let pl;
Array.from(VanillaWorld.getPlayers()).forEach((p) => {pl = p});
say (obj.getScoreInfo(pl, 2695).id);
    }
}


ChatCommand.registerCommand("test", new TestCommandExecutor());
ChatCommand.registerCommand("test2", new Test2CommandExecutor());
ChatCommand.registerCommand("suicide", (sender) => sender.kill() );


console.warn("scripts main end");