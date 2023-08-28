import { VanillaWorld, overworld } from "./basis.js";
import { Command } from "./command.js";
import { dealWithCmd } from "./commandutils.js";

export { log } from "./util/Logger.js";

/**
 * 向所有玩家以脚本引擎的身份发送一条消息。
 * （通常这用于向所有玩家广播脚本的运行状态）
 */
export function say(msg = "", displayNameOrSender="commands.origin.script"){
    let runner;
    let senderDisplayName;
    
    if (typeof displayNameOrSender === "string"){
        runner = overworld;
        senderDisplayName = { translate: displayNameOrSender };
    } else {
        runner = displayNameOrSender;
        senderDisplayName = { selector: "@s" };
    }
    let rawtext = [
        {
            translate: "chat.type.announcement",
            with: {
                rawtext: [
                    senderDisplayName,
                    { text: String(msg) }
                ]
            }
        }
    ]
    Command.addExecute(Command.PRIORITY_HIGH, runner, `tellraw @a ${JSON.stringify({rawtext})}`);
}

/**
 * 向指定玩家发送一条普通消息。
 * @param receiver 接收者，应该是玩家。
 * @param message 接收者，应该是玩家。
 */
export function send(receiver, message){
    if (receiver.sendMessage){
        return receiver.sendMessage(dealWithCmd(message, message));
    }
    let rawtext = JSON.stringify({rawtext:[{text: message}]}, dealWithCmd);
    Command.addExecute(Command.PRIORITY_HIGH, receiver, `tellraw @s ${rawtext}`);
}
