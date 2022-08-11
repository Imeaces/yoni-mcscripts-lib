import ChatCommand from "scripts/yoni/command/ChatCommand.js";
import { vanillaWorld, runCmd, vanillaScoreboard } from "scripts/yoni/basis.js";
import { say } from "scripts/yoni/util/yoni-lib.js";
import SimpleScoreboard from "scripts/yoni/scoreboard/SimpleScoreboard.js";
import Entry from "scripts/yoni/scoreboard/Entry.js";
import { Listener } from "scripts/yoni/Listener.js";
import { Player as VanillaEntity } from "mojang-minecraft";

class SpeciesCommandExecutor {
    onCommand(sender, rawCommand, label, args){
        let obj = SimpleScoreboard.getObjective("species");
        obj.setScore(sender, Number(args[0]));
    }
}
class TestCommandExecutor {
    onCommand(sender, rawCommand, label, args){
        let obj = SimpleScoreboard.getObjective("species");
        obj.addScore(sender, 3);
    }
}

ChatCommand.registerCommand("species", new SpeciesCommandExecutor());
ChatCommand.registerCommand("test", new TestCommandExecutor());
ChatCommand.registerCommand("suicide", (sender) => sender.kill() );

runCmd("titleraw @a times 0 20 0");

/*
Listener(vanillaWorld.events.tick, ()=> {
    runCmd("titleraw @a title {\"rawtext\":[{\"score\":{\"objective\":\"species\",\"name\":\"*\"}}]}");
});
*/
console.warn("scripts main end");