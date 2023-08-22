import { registerAsync, Test } from "./gametest.js";
import { world, GameMode } from "./minecraft.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";
import { randomName } from "./lib/getRandoms.js";

registerAsync("yonimcscriptslib", "scoreboard_test", scoreboard_test)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);

async function scoreboard_test(test: Test){
    const { VanillaWorld, Location, Scoreboard, ScoreboardEntry, DisplaySlot, world, YoniUtils } = await import("yoni-mcscripts-lib");
    //测试过程中发现模拟玩家不能传 //更新：已兼容
    let onePlayer = test.spawnSimulatedPlayer(Location.zero.getVanillaBlockLocation(),randomName(), GameMode.creative);
    
    //let onePlayer = world.getAllPlayers()[0];
    //test.assert(onePlayer != null, "记分板测试需要有一个在线的玩家");
    
    let obj = Scoreboard.getObjective(randomName(), true);

    let oneScoreInfo = obj.getScoreInfo(onePlayer);

    obj.setScore(onePlayer, 2344);
    test.assert(obj.getScore(onePlayer) === 2344, `分数设置不成功 ${obj.getScore(onePlayer)} !== 2344`);
    
    obj.getScoreInfos();
    
    oneScoreInfo.score = 2001;
    
    test.assert(obj.getScore(onePlayer) === 2001, "通过分数条目对象分数设置不成功");
    
    let a0_r: number = obj.randomScore(onePlayer, -21474848, 2147487);
    test.assert(obj.getScore(onePlayer) === a0_r, "随机设置分数出现未知错误");
    
    obj.addScore(onePlayer, 2333);
    test.assert(obj.getScore(onePlayer) === 2333 + a0_r, "分数添加出现未知错误");

    obj.removeScore(onePlayer, 8651);
    test.assert(oneScoreInfo.score === 2333 - 8651 + a0_r, "分数移除出现未知错误（读取途径ScoreInfo） "
        + oneScoreInfo.score 
        + " !== "
        + (2333 - 8651 + a0_r));

    test.assert(Scoreboard.removeObjective(obj), "记分项移除失败");

    let hasError = false;
    try {
        Scoreboard.getObjective(obj.id);
    } catch (e) {
        hasError = true;
    }
    
    test.assert(hasError, "记分项移除后尝试获取时没有出现报错");

    hasError = false;
    try {
        obj.removeScore(onePlayer, -8651);
    } catch (e) {
        hasError = true;
        obj = Scoreboard.addObjective(randomName());
    }
    
    test.assert(hasError, "记分项移除后尝试操作时没有出现报错");

    //另一种移除的方法
    Scoreboard.removeObjective(obj);

    obj = Scoreboard.addObjective(randomName());

    obj.setScore("awa", 6666);
    test.assert(obj.getScore("awa") === 6666, "虚拟玩家设置分数出现未知错误");
    
    obj.setScore("866test", 688);
    test.assert(obj.getScore("866test") === 688, "虚拟玩家 866test 设置分数出现未知错误");

    Scoreboard.setDisplayAtSlot(DisplaySlot.sidebar, {objective: obj});
    YoniUtils.say("现在侧边栏应该有名为 "+ obj.displayName + " 的记分项正在显示");
    
    await test.idle(200);
    
    test.succeed();
    
    Scoreboard.removeObjective(obj);
}