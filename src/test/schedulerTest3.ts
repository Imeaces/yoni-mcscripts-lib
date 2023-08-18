import { registerAsync, Test } from "./gametest.js";
import { system } from "./minecraft.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

async function scheulderTest(test: Test){
    const { YoniScheduler, Schedule } = await import("yoni-mcscripts-lib");
    
    YoniScheduler.runDelayTimerTask(() => {
        lastCallRealTime = Date.now();
    }, 4800);
    let lastCallRealTime = 0;
    
    await test.idle(4800/20 + 1);
    
    let internal = Date.now() - lastCallRealTime;
    
    if (internal > 0 && internal < 100){
        test.succeed();
    } else {
        test.fail("测试长任务延时失败，最终时间差："+internal);
    }
}

registerAsync("yonimcscriptslib", "scheulderTest3", scheulderTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
