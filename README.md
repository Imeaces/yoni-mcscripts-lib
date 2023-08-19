# yoni-mcscripts-lib

为部分接口创建了 wrapper，并提供事件管理器、任务管理器和其他的一些小工具。

当前支持的游戏版本为 正式版**1.20.10**。

## 使用

为了能在您的脚本中从 'yoni-mcscripts-lib' 中导入内容，你需要将编译后的文件手动复制到你的脚本目录中。

暂时未能支持 Webpack 打包，因为其中有一些东西并不是直接使用 import 语句导入的，所以并不能正确的被识别到。

## 进度

已经完成对方块和实体对象的包装。

尝试由 JSDoc 生成文档中（尚未开始）。

正在转到 Typescript，目前将近一半的代码已经使用 Typescript 编写。

尝试支持 Webpack 打包（正在进行）。

个人水平不足，基本上这只是给我自己用的。但是在有补全的情况下，你或许可以根据命名来猜测用法。我会尽快添加更多文档的。

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
