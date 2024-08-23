import { registerAsync, Test } from "./gametest.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";
import { randomName } from "./lib/getRandoms.js";
import { GameMode } from "./minecraft.js";


async function getPlayerTest(test: Test){
    const { world, Minecraft } = await import("yoni-mcscripts-lib");
    const { GameMode } = Minecraft;
    
    let name = randomName();
    
    let p = test.spawnSimulatedPlayer({ x: 0, y: 0, z: 0}, name, GameMode.creative);
    
    await test.idle(100);
    
    let qp = world.getPlayers({name});
    
    // @ts-ignore
    if (qp[0]?.vanillaPlayer === p)
        test.succeed();
    else
        test.fail("player get not success");
}

registerAsync("yonimcscriptslib", "getPlayer", getPlayerTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
