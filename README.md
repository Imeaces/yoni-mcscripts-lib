# yoni-mcscripts-lib

对Vanilla Scripts API进行了一定程度的重新封装，且仍在不断添加

当前支持的游戏版本为1.19.50、1.19.30（需要手动修改导入模块名）

尝试由JSDoc生成文档中……尚未开始

正在转到typescript，但由于我并没有运行vscode或其他ide的条件，所以进展缓慢，现在只是单纯的改了文件后缀

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

项目中使用了 lokiJS，这是一个以 JavaScript 编写的数据库访问接口，根据 MIT 协议授权许可。  
可以在 GitHub 上找到他的源代码：<https://github.com/techfort/LokiJS>
