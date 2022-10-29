import { VanillaWorld, overworld } from "yoni/basis.js";
import { Command } from "yoni/command.js";

export async function say(msg = "", displayNameOrSender="commands.origin.script"){
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
    return await Command.fetchExecute(runner, `tellraw @a ${JSON.stringify({rawtext})}`);
}

export async function send(receiver, message){
    let rawtext = JSON.stringify({rawtext:[{translate: String(message)}]})
    return await Command.fetchExecute(receiver, `tellraw @s ${rawtext}`);
}
