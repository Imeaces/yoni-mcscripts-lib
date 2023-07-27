import { ChatCommand } from "./command/ChatCommand.js";
import { Command } from "./command.js";
import { EntityBase, YoniPlayer } from "./entity.js";
import { Logger } from "./util/Logger.js";
import { EventListener } from "./event.js";
import { getErrorMsg } from "./lib/console.js";
import { config } from "./config.js";
import { runTask, Minecraft } from "./basis.js";

let logger = new Logger("debug_func");

let doEval: (sender: YoniPlayer, code: string) => Promise<any>;
let doEvalFunctionInitizePromise = initEvalFunction();

ChatCommand.registerPrefixCommand("$", "geval", onRequestChatEventAsEval);
ChatCommand.registerPrefixCommand("$", "eval", onEvalCommand);
EventListener.register("minecraft:beforeEvents.chatSend", onChatEventAsEval);

async function initEvalFunction(){
    let generateFunctionCodeLines = [];
    
    // yoni-mcscripts-lib
    const yonilib = await import("./index.js");
    for (const variable in yonilib){
        generateFunctionCodeLines.push(`let { ${variable} } = arguments[0];`);
    }
    
    // util
    generateFunctionCodeLines.push(`let { say, send } = YoniUtils;`);

    // ObjectUtils
    const { ObjectUtils } = await import("./lib/ObjectUtils.js");
    generateFunctionCodeLines.push("let { getKeys } = arguments[1];");
    
    // timeout lib
    const timeoutlib = await import("./lib/Timeout.js");
    for (const variable in timeoutlib){
        generateFunctionCodeLines.push(`let { ${variable} } = arguments[2];`);
    }
    
    // memory storage
    const s = Object.create(null);
    generateFunctionCodeLines.push("let s = arguments[3];");
    
    // logger
    generateFunctionCodeLines.push("let logger = arguments[4];");
    
    // dpEval Function Code
    generateFunctionCodeLines.push(`
    function doEval(sender, code){
        async function evalCode(){
            return eval(code);
        }
        return evalCode();
    }
    `);
    generateFunctionCodeLines.push("return doEval;");
    
    let generateFunction = new Function(generateFunctionCodeLines.join("\n"));
    
    logger.info(generateFunctionCodeLines.join("\n"));
    
    doEval = generateFunction(yonilib, ObjectUtils, timeoutlib, s, logger);
}

const chatAsEvalPlayers = new Set<YoniPlayer>();

function onEvalCommand(sender: YoniPlayer, command: string, label: string, args: string[]){
    if (!hasPermission(sender)){
        sender.sendMessage("§c没有权限");
        return;
    }
    let code = command.slice(command.indexOf(" ")+1);
    executeEval(sender, code);
}
function onChatEventAsEval(event: Minecraft.ChatSendBeforeEvent){
    const player = EntityBase.from(event.sender) as unknown as YoniPlayer;
    if (chatAsEvalPlayers.has(player)){
        event.cancel = true;
        executeEval(player, event.message);
    }
}
function onRequestChatEventAsEval(sender: YoniPlayer, command: string, label: string, args: string[]){
    if (!hasPermission(sender)){
        sender.sendMessage("§c没有权限");
        return;
    }
    if (chatAsEvalPlayers.has(sender)){
        sender.sendMessage("§b已关闭聊天信息直接作为代码运行");
        chatAsEvalPlayers.delete(sender);
    } else {
        sender.sendMessage("§e已开启聊天信息直接作为代码运行");
        runTask(() => chatAsEvalPlayers.add(sender));
    }
}
function hasPermission(player: YoniPlayer | Minecraft.Player): boolean {
    return player.isOp();
}
function executeEval(sender: YoniPlayer, code: string){
    if (!hasPermission(sender)){
        sender.sendMessage("§c没有权限");
        return;
    }
    sender.sendMessage("> "+code);
    
    doEval(sender, code)
    .then(onSuccess)
    .catch(onError);
    
    function onSuccess(result: any){
        (globalThis as any)._ = result;
        sender.sendMessage("§7" + String(result));
    }
    function onError(error: any){
        (globalThis as any)._error = error;
        sender.sendMessage("§c" + getErrorMsg(error).errMsg);
    }
}

ChatCommand.registerPrefixCommand("$", "exec", async (sender: YoniPlayer, rawCommand, label, args) => {
    let cmd = rawCommand.slice(label.length+1);
    sender.sendMessage("/"+cmd);
    let rt = await sender.fetchCommand(cmd);
    sender.sendMessage("§7"+ JSON.stringify(rt) );
});
ChatCommand.registerPrefixCommand("$", "run", (sender, rawCommand, label, args) => {
    let cmd = rawCommand.slice(label.length+1);
    sender.sendMessage("/"+cmd);
    let rt = Command.run(cmd);
    sender.sendMessage("§7"+ JSON.stringify(rt) );
});

doEvalFunctionInitizePromise.then( () => 
logger.info("debug功能已加载，使用$eval可以执行代码"))
.catch( (e) => 
logger.info("debug功能加载出现错误", e));
