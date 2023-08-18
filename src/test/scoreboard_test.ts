import { registerAsync, Test } from "./gametest.js";
import { world, GameMode } from "./minecraft.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";
import { randomName } from "./lib/getRandoms.js";

registerAsync("yonimcscriptslib", "scoreboard_test", scoreboard_test)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);

async function scoreboard_test(test: Test){
    const { VanillaWorld, Scoreboard, ScoreboardEntry, DisplaySlot, world } = await import("yoni-mcscripts-lib");
    //测试过程中发现模拟玩家不能传
    //let onePlayer = test.spawnSimulatedPlayer({x:0,y:0,z:0},randomName(), GameMode.creative);
    
    let onePlayer = world.getAllPlayers()[0];
    test.assert(onePlayer != null, "记分板测试需要有一个在线的玩家");
    
    let obj = Scoreboard.getObjective(randomName(), true);

    let oneScoreInfo = obj.getScoreInfo(onePlayer);

    obj.setScore(onePlayer, 2344);
    test.assert(obj.getScore(onePlayer) === 2344, "分数设置不成功");
    
    obj.getScoreInfos();
    
    oneScoreInfo.score = 2001;
    
    test.assert(obj.getScore(onePlayer) === 2001, "通过分数条目对象分数设置不成功");
    
    let a0_r: number = obj.randomScore(onePlayer, -21474848, 2147487);
    test.assert(obj.getScore(onePlayer) === a0_r, "随机设置分数出现未知错误");
    
    obj.addScore(onePlayer, 2333);
    test.assert(obj.getScore(onePlayer) === 2333 + a0_r, "分数添加出现未知错误");

    obj.removeScore(onePlayer, 2333);
    test.assert(oneScoreInfo.score === 2333 - 8651 + a0_r, "分数移除出现未知错误");

    Scoreboard.removeObjective(obj);
    
    let hasError = false;
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
    world.sendMessage("现在侧边栏应该有名为 "+ obj.displayName + " 的记分项正在显示");
    
    await test.idle(200);
    
    test.succeed();
}