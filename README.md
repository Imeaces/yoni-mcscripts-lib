# yoni-mcscripts-lib

对Vanilla Scripts API进行了一定程度的重新封装，且仍在不断添加

当前支持的游戏版本为1.19.50、1.19.30（需要手动修改导入模块名）

## 为什么仍然是 1.19.50

即使目前的版本已经来到了1.19.70.22，我也不打算转到更新的版本。这有一个很奇怪的原因

> 1.19.60之前，即使你在manifest.json中指定的依赖不可用（比如在游戏端中指定了 `@minecraft/mojang-net` 作为依赖），脚本仍然可以运行，只是可能不会按照预期效果工作
> 而在1.19.60版本中，以及之后的版本中，如果你在 manifest.json 中指定的依赖不可用，将会导致脚本不运行

这听起来没什么的，对吧？只不过无法进行动态加载了。

但是这还有另一个bug。

> 如果你的行为包依赖了另一个附加包（比如一个资源包），特定情况（执行/reload时）下游戏会将这个附加包作为一个依赖，来查找脚本使用的依赖。
> 很明显，什么都不会找到，所以只会提示模块不存在
> 但是新版本中禁止了指定模块未补全的脚本包的运行
> 这导致无法在游戏中使用/reload重载脚本，除非不为行为包添加其他的依赖。

这点对我来说不是很舒服。

## 未来计划

完成各种对象的映射

完成以容器为基础的存储系统

尝试由JSDoc生成文档中……尚未开始

正在转到typescript，但由于我并没有运行vscode或其他ide的条件，所以进展缓慢，现在只是单纯的改了文件后缀

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

项目中使用了 lokiJS，这是一个以 JavaScript 编写的数据库访问接口，根据 MIT 协议授权许可。  
可以在 GitHub 上找到他的源代码：<https://github.com/techfort/LokiJS>
