import { StatusCode, overworld, runTask, genCmdByParams } from "yoni/basis.js";
import { debug } from "yoni/config.js";
import { getErrorMsg } from "yoni/util/console.js";

let log = ()=>{};
if (debug){
    import("yoni/util/Logger.js")
    .then(m=>{
        let logger = new m.Logger("Command");
        log = (...args)=>{ logger.debug(...args); };
    });
}

let commandQueues = [[], [], [], [], []];

//空间换时间（滑稽）
function hasNextQueue(){
    if (commandQueues[4].length
    || commandQueues[3].length
    || commandQueues[2].length
    || commandQueues[1].length
    || commandQueues[0].length){
        return true;
    }
    return false;
}
function countNextQueues(){
    return commandQueues[4].length
    + commandQueues[3].length
    + commandQueues[2].length
    + commandQueues[1].length
    + commandQueues[0].length;
}
function fetchNextQueue(){
    if (commandQueues[4].length){
        return commandQueues[4][0];
    }
    if (commandQueues[3].length){
        return commandQueues[3][0];
    }
    if (commandQueues[2].length){
        return commandQueues[2][0];
    }
    if (commandQueues[1].length){
        return commandQueues[1][0];
    }
    if (commandQueues[0].length){
        return commandQueues[0][0];
    }
}
function removeNextQueue(){
    if (commandQueues[4].length){
        commandQueues[4].shift();
    } else if (commandQueues[3].length){
        commandQueues[3].shift();
    } else if (commandQueues[2].length){
        commandQueues[2].shift();
    } else if (commandQueues[1].length){
        commandQueues[1].shift();
    } else if (commandQueues[0].length){
        commandQueues[0].shift();
    }
}
import("./command/ChatCommand.js")
.then(m=>{
    m.ChatCommand.registerCustomPrefixCommand("$", "cmdm", (sender, _, __, args)=>{
        if (args[0] === "clearandprint"){
            let str = ""; //JSON.stringify(commandQueues[3]);
            for (let s of commandQueues[2]){
                str += s.command + "\n";
            }
            commandQueues = [[], [], [], [], []];
            log(str);
            log("done");
        }
    });
});
let lastFailedCommand = null;
let executeQueueCount = 0;
async function executeCommandQueues(){
    executeQueueCount = 0;
    runTask(executeCommandQueues);
    try {
    while (hasNextQueue() && executeQueueCount++ < 10000){
        //从队列plus中取得一个排队中的命令
        let commandQueue = fetchNextQueue();
        //然后将命令送入minecraft 的命令队列
        let commandPromise;
        try {
            let p = commandQueue.sender.runCommandAsync(commandQueue.command);
            commandQueue.resolveResult(p);
        } catch(error) { //如果没送入成功，说明minecraft 命令队列已满(也可能你故意传了个用不了的sender)，结束等待下次开始
            if (commandQueue === lastFailedCommand){
                lastFailedCommand.reject(error);
                removeNextQueue();
                log("队列中的命令执行失败 /{}\n{}", lastFailedCommand.command, error);
            } else {
                log("队列已满或出现其他错误，如果下次该命令仍然推入错误，将会不执行此命令，已成功推入 {} 条命令，还有 {} 条正在等待\n{}", executeQueueCount, countNextQueues(), error);
                lastFailedCommand = commandQueue;
            }
            break;
        }
        //送入之后将队列中的命令移除
        removeNextQueue();
    }
    } catch (e){
        console.error(getErrorMsg(e).errMsg);
    }
}

export class CommandQueue {
    sender;
    command;
    resolve;
    async resolveResult(commandPromise){
        
        //然后是获取命令结果(但是现在已经没有结果了)
        let commandResult;
        try {
            let rt = await commandPromise;
            //statusCode啥的都没了，只能自己修复一下了
            //有点想骂人，真就啥都不想给开发者用呗
            commandResult = {
                statusCode: StatusCode.success,
                successCount: rt.successCount
            };
        } catch (commmandExecuteErrorMessage){
            console.error(commmandExecuteErrorMessage);
            try {
                commandResult = JSON.parse(commmandExecuteErrorMessage);
            } catch {
                try {
                    commandResult = {
                        statusCode: StatusCode.error,
                        statusMessage: String(commmandExecuteErrorMessage)
                    };
                } catch(eq){
                    console.error(eq);
                }
            }
        }
        this.resolve(commandResult);
    }
    constructor(sender, command, resolve, reject){
        if (typeof sender?.runCommandAsync !== "function"){
            throw new TypeError("sender cannot runCommandAsync()");
        }
        this.sender = sender;
        this.command = command;
        this.resolve = resolve;
        this.reject = reject;
    }
}

export default class Command {
    
    static PRIORITY_HIGHEST = 5;
    static PRIORITY_HIGH = 4;
    static PRIORITY_NORMAL = 3;
    static PRIORITY_LOW = 2;
    static PRIORITY_LOGEST = 1;
    
    static fetch(command){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, command);
    }
    static fetchParams(...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, genCmdByParams(...params));
    }
    static fetchExecuteParams(sender, ...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, genCmdByParams(...params));
    }
    static fetchExecute(sender, command){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, command);
    }
    
    static add(priority, command){
        return Command.addExecute(priority, overworld, command);
    }
    static addParams(priority, ...params){
        return Command.addExecute(priority, overworld, genCmdByParams(...params));
    }
    static addExecuteParams(priority, sender, ...params){
        return Command.addExecute(priority, sender, genCmdByParams(...params));
    }
    //某些命令需要以尽可能快的速度执行，故添加此函数，可设置命令权重
    //然后我就把所有命令都用这个来执行了
    static addExecute(priority, sender, command){
        let resolve, reject;
        let promise = new Promise((re, rj)=>{
            resolve = re;
            reject = rj;
        });
        if (priority-1 in commandQueues){
            commandQueues[priority-1].push(new CommandQueue(sender, command, resolve, reject));
            return promise;
        } else {
            throw new Error("Unknown command priority " + String(priority));
        }
    }
    
    static async postExecute(sender, commands){
        commands = Array.from(commands);
        let promises = commands.map((cmd)=>Command.fetchExecute(sender, cmd));
        let results = [];
        for (let pro of promises){
            results.push(await pro);
        }
        return Promise.all(results);
    }
}

export { Command };

/*

function isEducationEdition(){
    return false;
}

//need more ideas

export class TargetSelector {
    #selector;
    #arguments = [];
    constructor(selector){
        switch(selector){
            case "@c":
            case "@v":
                if (!isEducationEdition()){
                    throw new Error(); 
                }
            case "@s":
            case "@p":
            case "@r":
            case "@a":
                this.#selector = selector;
                break;
            default:
                throw new SyntaxError("Unknown TargetSelector: "+selector);
        }
    }
    addArgument(cond, arg){
        switch(condition){
            case "name":
                this.#arguments.push({
                    condition: cond,
                    argument: arg
                });
                break;
            default:
                this.arguments.push({
                    condition: cond,
                    argument: arg
                });
        }
        return this;
    }
}


export { Command }

function resolveTargetSelectors(...selectors){
    let selectedEntities = [];
    selectors.forEach((selector) => {
        resolveTargetSelector(selector).forEach((entity) => {
            if (selectedEntities.indexOf(entity) == -1)
                selectedEntities.push(entity);
        });
    });
}

function resolveTargetSelector(selector){
    let selectedEntities = [];

    try {
        let tag = String(Math.random());
        Command.run(`tag ${selector} add "${tag}"`);
        getLoadedEntities().forEach((entity) => {
            if (entity.hasTag(tag))
                selectedEntities.push(entity);
        });
        Command.run(`tag ${selector} remove "${tag}"`);

    } catch {
        selectedEntities = [];
    }

    return selectedEntities;
}
*/
runTask(executeCommandQueues);
