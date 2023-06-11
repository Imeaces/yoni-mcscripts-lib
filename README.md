# yoni-mcscripts-lib

对Vanilla Scripts API进行了一定程度的重新封装，且仍在不断添加

当前支持的游戏版本为1.19.80

完成各种对象的映射

~~完成以容器为基础的存储系统~~

尝试由JSDoc生成文档中……尚未开始

正在转到typescript，目前将近一半的代码已经使用typescript编写

## 功能

基本上是对原有API的一些wrapper，除此之外还提供了一些便捷的小工具。
个人水平不足，基本上这只是给我自己用的。但是在有补全的情况下，你或许可以根据命名来猜测用法。我会尽快添加更多文档的。

Most classes are wrappers. Besides, here are some simple utils.
No more documents, I will add them later.

## 示例

您可以用这种方法来使用
```js
import { Scoreboard, Utils } from "yoni/index.js";

(async function (){
//部分函数为异步函数，故需要在异步函数内用await调用
//这里简单示范了Scoreboard的用法，由于mojang并没有给出任何设置分数的api，故只能用命令完成分数的设置。
//而获取分数有相应的api可以使用，故不需要异步获取

let obj = Scoreboard.getObjective("obj1");
if (obj === null){
    obj = Scoreboard.addObjective("obj1", "dummy");
}

let onePlayer = World.getPlayers()[0];

await obj.postSetScore(onePlayer, -3987)

Utils.say(`玩家 ${onePlayer.name} 在 ${obj.displayName} 上的分数为 ${obj.getScore(onePlayer)}`); //分数为 -3987

Utils.say("现在重置他的分数");

await obj.postResetScore(onePlayer);

Utils.say(`玩家 ${onePlayer.name} 在 ${obj.displayName} 上的分数为 ${obj.getScore(onePlayer)}`); //分数为 undefined

})();

```

## 引用

目前尚无实际被引用的内容

## 使用

为了能在您的脚本中从'yoni-mcscripts-lib'中导入内容，你需要将编译后的文件手动复制到你的脚本目录中。

To use 'yoni-mcscripts-lib' as a runtime, you must copy the compiled files into 'scripts/' directory manually.
