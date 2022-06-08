import * as gt from "mojang-gametest";
import * as gui from "mojang-minecrart-ui";
import * as mc from "mojang-minecraft";


const world = mc.world;
const events = mc.world.events;
const scoreboard = mc.world.scoreboard;

function dim(dimid = "overworld"){
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

/**
 * @deprecated - use Command.execute() or Command.run()
 * @param {String} - command
 * @param {RunnableObject} - 
 * @return {JSON}
 */
function runCmd(command = "", commandRunner){
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

export {
  gt as GT,
  gui as GUI,
  mc as MC,
  
  world,
  events,
  scoreboard,
  
  dim,
  runCmd
};
