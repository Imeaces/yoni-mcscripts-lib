import { StatusCode, overworld, runTask } from "./basis.js";
import { debug } from "./config.js";
import { getErrorMsg } from "./util/console.js";
import { getKeys } from "./lib/utils.js";


let log = ()=>{};

const testIfHasSpecificChar = /(["'\\])/g;
const testIfHasSpaceChar = /(\s)/g;
export function getCommand(cmd, ...args){
    if (args?.length === 1 && Array.isArray(args[0])){
        args = args[0];
    }
    if (args.length !== 0){
        args.forEach((arg) => {
            arg = String(arg);
            if (testIfHasSpecificChar.test(arg)){
                arg = arg.replaceAll(testIfHasSpecificChar, "\\$1");
            }
            if (testIfHasSpaceChar.test(arg)){
                arg = `"${arg}"`;
            }
            cmd += ` ${arg}`;
        });
    }
    return cmd;
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

let lastFailedCommand = null;
let executeQueueCount = 0;
async function executeCommandQueues(){
    executeQueueCount = 0;
    runTask(executeCommandQueues);
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
}

export class CommandQueue {
    sender;
    command;
    resolve;
    async resolveResult(commandPromise){
        
        //然后是获取命令结果(但是现在已经没有结果了)
        let commandResult;
        try {
            //statusCode啥的都没了，只能自己修复一下了
            //有点想骂人，真就啥都不想给开发者用呗
            let rt = await commandPromise;
            let obj = { statusCode: StatusCode.success };
            let objKeys = getKeys(obj);
            getKeys(rt).forEach(key=>{
                if (objKeys.includes(key)){
                    return;
                }
                obj[key] = rt[key];
            });
            commandResult = obj;
        } catch (commmandExecuteErrorMessage){
            commandResult = {
                statusCode: StatusCode.error,
                statusMessage: String(commmandExecuteErrorMessage)
            };
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
    static PRIORITY_LOWEST = 1;
    
    static fetch(command){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, command);
    }
    static fetchParams(...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, getCommand(...params));
    }
    static fetchExecuteParams(sender, ...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, getCommand(...params));
    }
    static fetchExecute(sender, command){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, command);
    }
    
    static add(priority, command){
        return Command.addExecute(priority, overworld, command);
    }
    static addParams(priority, ...params){
        return Command.addExecute(priority, overworld, getCommand(...params));
    }
    static addExecuteParams(priority, sender, ...params){
        return Command.addExecute(priority, sender, getCommand(...params));
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
    
    static getCommand(command, ...args){
        return getCommand(command, ...args);
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

runTask(executeCommandQueues);

if (debug){
    import("./util/Logger.js")
    .then(m=>{
        let logger = new m.Logger("Command");
        log = logger.debug;
    });
    
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
}