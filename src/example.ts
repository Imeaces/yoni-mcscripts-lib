import { EventListener, EventHandler, Minecraft, Scoreboard, Objective, YoniUtils, YoniScheduler, YoniPlayer, world, Logger } from "yoni-mcscripts-lib";

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


//未经过测试
@EventListener({static: true})
class MainClass{

    @EventHandler({event: Minecraft.EntityHealthChangedAfterEvent, options: {}})
    static onEvent(event: Minecraft.EntityHealthChangedAfterEvent){
    }
}

//Logger使用

const logger = new Logger("yoni-mcscripts-lib");

logger.info("加载！");
logger.error("报错", new Error());
logger.warn("警告");
logger.debug("可能需要手动启用");
logger.trace("一般这个等级的日志都是无用的信息");
