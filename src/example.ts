// 实际上类似于这样，并且还要求文件的位置位于 scripts/ 目录下。
//import { Scoreboard, Objective, YoniUtils, YoniScheduler, YoniPlayer, world } from "yoni/index.js";
import { Scoreboard, Objective, YoniUtils, YoniScheduler, YoniPlayer, world } from "yoni-mcscripts-lib";

// 简单示范了 Scoreboard 的用法，这个类是对原版的记分板
// 访问 API 的重新封装，并添加了一些没有的方法。

YoniScheduler.runDelayTickTask(function doSome(){
    let objective0: Objective;
    try {
        //记分项不存在的话获取会出现错误
        objective0 = Scoreboard.getObjective("objective_0");
    } catch {
        objective0 = Scoreboard.addObjective("objective_0");
    }

    // 或者可以这样，传入第二个参数 true，表示在记分项不存在的时候
    // 使用 dummy 准则创建同名记分项。
    const objective1: Objective = Scoreboard.getObjective("objective_1", true);

    //只适合单人的获取玩家的方法
    const onePlayer: YoniPlayer = world.getAllPlayers()[0];

    if (onePlayer == null){
        YoniUtils.say("怎么就一个玩家都没有的？");
        return;
    }

    objective0.setScore(onePlayer, -3987);
    YoniUtils.say(`玩家 ${onePlayer.name} 在 ${objective0.displayName} 上的分数为 ${objective0.getScore(onePlayer)}`); //分数为 -3987

    YoniUtils.say("现在重置他的所有分数");
    Scoreboard.resetScore(onePlayer);
    YoniUtils.say(`玩家 ${onePlayer.name} 在 ${objective0.displayName} 上的分数为 ${objective0.getScore(onePlayer)}`); //分数为 undefined
    YoniUtils.say(`玩家 ${onePlayer.name} 在 ${objective1.displayName} 上的分数为 ${objective1.getScore(onePlayer)}`); //分数为 undefined

    YoniUtils.say("现在往他的记分项1上添加 233 分");
    objective1.addScore(onePlayer, 233);
    YoniUtils.say(`玩家 ${onePlayer.name} 在 ${objective1.displayName} 上的分数为 ${objective1.getScore(onePlayer)}`); //分数为 233

}, 1200);
//延迟一分钟再执行（1*60*20=1200）

