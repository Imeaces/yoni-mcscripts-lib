import { registerAsync, Test } from "./gametest.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";
import { randomName } from "./lib/getRandoms.js";
import { GameMode } from "./minecraft.js";


async function getPlayerTest(test: Test){
    const { world, Minecraft, Location } = await import("yoni-mcscripts-lib");
    const { GameMode } = Minecraft;
    
    let name = randomName();
    
    let p = test.spawnSimulatedPlayer(Location.zero.getVanillaBlockLocation(), name, GameMode.creative);
    
    await test.idle(100);
    
    let qp = world.getPlayers({name});
    
    if (qp[0]?.vanillaPlayer === p)
        test.succeed();
    else
        test.fail("player get not success");
}

registerAsync("yonimcscriptslib", "getPlayer", getPlayerTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
