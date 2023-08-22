import { registerAsync, Test } from "./gametest.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

//此测试暂时没有很好的办法通过

async function scheulderTest(test: Test){
    const { YoniScheduler, LegacyMinecraft } = await import("yoni-mcscripts-lib");
    let taskCallTime: number = -1;
    
    LegacyMinecraft.runTimeout(() =>
    YoniScheduler.runDelayTickTask(() => {
        taskCallTime = LegacyMinecraft.getCurrentTick();
    }, 56)
    , 1);
    
    let taskAddTime = LegacyMinecraft.getCurrentTick();
    
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
    .required(false)
    .maxTicks(300*20);
