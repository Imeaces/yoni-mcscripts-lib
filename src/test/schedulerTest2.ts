import { registerAsync, Test } from "./gametest.js";
import { system } from "./minecraft.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

async function scheulderTest(test: Test){
    const { YoniScheduler, Schedule } = await import("yoni-mcscripts-lib");
    
    const schedule = new Schedule({
        type: Schedule.cycleTickSchedule,
        delay: 20, period: 7
    }, () => {
        callTimes += 1;
    });
    
    let callTimes: number = 0;
    
    YoniScheduler.addSchedule(schedule);
    
    try {
        await test.idle(schedule.delay+1);
        
        if (callTimes !==1){
            throw "任务没有在延迟后开始执行并执行一次";
        }
        
        await test.idle(schedule.period*47 + 1);
        
        if ((callTimes as number) !==48){
            throw "任务没有在一定时间内循环指定次数";
        }
        
    } catch(e){
        test.fail(e as string);
    }
    
    YoniScheduler.removeSchedule(schedule);
    
    test.succeed();
}

registerAsync("yonimcscriptslib", "scheulderTest2", scheulderTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
