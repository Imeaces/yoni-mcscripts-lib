# yoni-mcscripts-lib

为 Minecraft Script API 中的部分接口创建了 wrapper，并提供简单的事件管理器和任务管理器，另附有一些便于代码编写的一些小工具。

当前支持的游戏版本为 正式版**1.20.10**。

## 使用

个人水平不足，基本上这只是给我自己用的，还没有一个很好的说明文档。但是在有补全的情况下，你或许可以根据命名来猜测用法。我会尽快添加更多文档的。

为了能在您的脚本中从 'yoni-mcscripts-lib' 中导入内容，你需要将编译后的文件手动复制到你的脚本目录中。

理论上已经可以直接使用 Webpack 打包，除了旧事件系统相关部分（指LegacyEvent，建议用新的不要用旧的，旧的说不定哪天我心情不好删了）。

## 进度

创建包括实体在内的一系列包装类（已经完成）。

由 JSDoc 或 TSDoc 生成文档中（尚未开始）。

尝试使用 Webpack 打包（尚未开始）。

## 示例

一段简单的示例代码，另外，你还可以查看测试中的代码（位于[src/test/](./src/test/)）。

```ts
// 实际上类似于这样，并且还要求文件的位置位于 scripts/ 目录下。
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

    YoniUtils.say("现在重置他的分数");

    objective0.resetScore(onePlayer);

    YoniUtils.say(`玩家 ${onePlayer.name} 在 ${objective0.displayName} 上的分数为 ${objective0.getScore(onePlayer)}`); //分数为 undefined

}, 1200);
//延迟一分钟再执行（1*60*20=1200）

```

## 引用

目前尚无除了 @minecraft 之外的引用。

## Page Views

我也不知道加这个是干嘛

[![Page Views Count](https://badges.toozhao.com/badges/01H306S1JD8VWVQ03QW1EYPR0E/orange.svg)](https://badges.toozhao.com/stats/01H306S1JD8VWVQ03QW1EYPR0E "Get your own page views count badge on badges.toozhao.com")
[![npm version](https://badge.fury.io/js/yoni-mcscripts-lib.svg)](https://badge.fury.io/js/yoni-mcscripts-lib)
