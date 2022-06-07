import * as gt from "mojang-gametest";
import * as gui from "mojang-minecrart-ui";
import * as mc from "mojang-minecraft";

export default { GT, GUI, MC };

export default const world = mc.world;
export default const events = mc.world.events;
export default const scoreboard = mc.world.scoreboard;

export default function dim(dimid = "overworld"){
  switch (dimid) {
    case -1:
    case "nether":
      return world.getDimension("nether");
    case 1:
    case "the end":
    case "the_end":
      return world.getDimension("the end");
    default:
      return world.getDimension("overworld");
  }
}

export default function runCmd(command = "", commandRunner){
  if (typeof commandRunner == "undefined"){
    try {
      return dim(0).runCommand(command);
    } catch(err) {
      return err;
    };
  } else {
    try {
      return commandRunner.runCommand(command);
    } catch(err) {
      return err;
    };
  }
}
