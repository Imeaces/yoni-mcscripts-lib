import { registerAsync, Test } from "./gametest.js";
import { system } from "./minecraft.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

async function scheulderTest(test: Test){
    const { YoniScheduler } = await import("yoni-mcscripts-lib");
    let taskCallTime: number = -1;
    
    YoniScheduler.runDelayTickTask(() => {
        taskCallTime = system.currentTick;
    }, 56);
    let taskAddTime = system.currentTick;
    
    await test.idle(80);
    
    if (taskCallTime - taskAddTime === 56){
        test.succeed();
    } else {
        test.fail("任务没有在预期的时间运行"+(taskCallTime - taskAddTime));
    }
}

registerAsync("yonimcscriptslib", "scheulderTest1", scheulderTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
