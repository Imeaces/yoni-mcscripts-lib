import { StatusCode, overworld } from "./basis.js";
import { config } from "./config.js";
import { CommandPriority } from "./command/CommandPriority.js";
import { AsyncCommandSender } from "./command/AsyncCommandSender.js";
import { CommandSender } from "./command/CommandSender.js";
import { CommandResult } from "./command/CommandResult.js";
import { CommandExecutor } from "./command/CommandExecutor.js";
import { CommandQueue } from "./command/CommandQueue.js";
import { AsyncCommandQueue } from "./command/AsyncCommandQueue.js";
import { AsyncCommandExecutor } from "./command/AsyncCommandExecutor.js";

export { CommandPriority,
 AsyncCommandSender,
 CommandSender,
 CommandResult,
 CommandExecutor,
 AsyncCommandExecutor,
}

export class Command {
    static #asyncCommandExecutor = new AsyncCommandExecutor(true);
    static #syncCommandExecutor = new CommandExecutor(true);
    static config = (function getCommandConfig(){
        let commandConfig = config.getConfig("command");
        if (!commandConfig)
            commandConfig = config.createConfig("command");
        return commandConfig;
    })();
    
    static PRIORITY_HIGHEST = CommandPriority.highest;
    static PRIORITY_HIGH = CommandPriority.high;
    static PRIORITY_NORMAL = CommandPriority.medium;
    static PRIORITY_LOW = CommandPriority.low;
    static PRIORITY_LOWEST = CommandPriority.lowest;
    
    /**
     * 返回队列中未执行的命令的数量
     * @returns {number}
     */
    static countQueues(): number {
        return Command.#asyncCommandExecutor.commandList.count();
    }
    
    /**
     * Execute a command asynchronously
     * @param {string} command
     */
    static fetch(command: string){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, command);
    }
    /**
     * execute a command asynchronously with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(command: string, ...params: string[]){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, Command.getCommand(command, params));
    }
    /**
     * execute a command with params by specific sender
     * @param {AsyncCommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender: AsyncCommandSender, command: string, ...params: string[]){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, Command.getCommand(command, params));
    }
    /**
     * execute a command by specific sender
     * @param {AsyncCommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender: AsyncCommandSender, command: string){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, command);
    }
    
    /**
     * add a command to specific priority to execute
     * @param {CommandPriority} priority 
     * @param {string} command 
     * @returns {Promise<CommandResult>}
     */
    static add(priority: CommandPriority, command: string){
        return Command.addExecute(priority, overworld, command);
    }
    /**
     * add a command with params to specific priority to execute
     * @param {CommandPriority} priority 
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addParams(priority: CommandPriority, command: string, ...params: string[]){
        return Command.addExecute(priority, overworld, Command.getCommand(command, params));
    }
    
    /**
     * add a command with params to specific priority to execute by sender
     * @param {CommandPriority} priority 
     * @param {AsyncCommandSender} sender
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addExecuteParams(priority: CommandPriority, sender: AsyncCommandSender, command: string, ...params: string[]){
        return Command.addExecute(priority, sender, Command.getCommand(command, params));
    }
    
    //某些命令需要以尽可能快的速度执行，故添加此函数，可设置命令权重
    //然后我就把所有命令都用这个来执行了
    /**
     * 在对象上调用 `runCommandAsync` 执行命令。
     * @param {CommandPriority} priority 
     * @param {AsyncCommandSender} sender 
     * @param {string} command 
     * @returns {Promise<CommandResult>}
     */
    static addExecute(priority: CommandPriority, sender: AsyncCommandSender, command: string): Promise<CommandResult> {
        if (Command.config.getBoolean("useSyncExecutorOnAsyncExecute")){
            // @ts-ignore 特性，出问题别怪我
            return Command.addSyncExecute(priority, sender, command);
        }
        
        let resolve: any, reject: any;
        let promise = new Promise((re, rj)=>{
            resolve = re;
            reject = rj;
        }) as Promise<CommandResult>;
        
        const queue = new AsyncCommandQueue(sender, command,
            (result: any) => {
                const commandResult = Command.generateCommandResult(true, result);
                resolve(commandResult);
            },
            (result: any) => {
                const commandResult = Command.generateCommandResult(false, result);
                reject(commandResult);
            }
        );
        Command.#asyncCommandExecutor.commandList.add(priority, queue);
        
        return promise;
        throw new Error("Unknown command priority " + String(priority));
    }
    static addSyncExecute(priority: CommandPriority, sender: CommandSender, command: string): Promise<CommandResult> {
        let resolve: any, reject: any;
        let promise = new Promise((re, rj)=>{
            resolve = re;
            reject = rj;
        }) as Promise<CommandResult>;
        
        const queue = new CommandQueue(sender, command);
        Command.#syncCommandExecutor.commandList.add(priority, queue);
        queue.onresolve((result: any) => {
            const commandResult = Command.generateCommandResult(true, result);
            resolve(commandResult);
        });
        queue.onreject((result: any) => {
            const commandResult = Command.generateCommandResult(false, result);
            reject(commandResult);
        });
        
        return promise;
    }
    
    /**
     * generates a command by a set of params, and try to make sure that every arg is standalone
     * @param {string} cmd 
     * @param  {string[]|...string} args 
     * @returns {string} command
     */
    static getCommand(command: string, ...args: string[]): string;
    static getCommand(command: string, args: string[]): string;
    static getCommand(cmd: string, ...args: string[] | [string[]] ): string {
        const specificCharGlobalRegex = /(["'\\])/g;
        const specificCharRegex = /(["'\\])/;
        const spaceCharRegex = /(\s)/g;
        
        if (args?.length === 1 && Array.isArray(args[0])){
            args = args[0];
        }
        const params = [cmd];
        //遍历每个参数，对满足某一条件的参数进行处理
        for (let arg of args.map(String)){
            let shouldQuote = false;
            
            //空参数
            if (arg.trim().length === 0){ 
                shouldQuote = true;
            }
            
            //空格
            if (spaceCharRegex.test(arg)){
                shouldQuote = true;
            }
            
            //转义特殊符号
            if (specificCharGlobalRegex.test(arg)){ 
                arg = arg.replaceAll(specificCharGlobalRegex, "\\$1");
            }
            
            //如果需要引号，则添加引号
            if (shouldQuote){ 
                arg = `"${arg}"`;
            }
            params.push(arg);
        }
        return params.join(" ");
    }
    
    static getCommandMoreStrict(command: string, ...args: string[]): string;
    static getCommandMoreStrict(command: string, args: string[]): string;
    static getCommandMoreStrict(cmd: string, ...args: string[] | [string[]] ): string {
        const specificCharGlobalRegex = /(["'\\])/g;
        const specificCharRegex = /(["'\\])/;
        const spaceCharRegex = /(\s)/g;
        const startsWithNumberRegex = /^[0-9]/;
        
        if (args?.length === 1 && Array.isArray(args[0])){
            args = args[0];
        }
        const params = [cmd];
        //遍历每个参数，对满足某一条件的参数进行处理
        for (let arg of args.map(String)){
            let shouldQuote = false;
            
            //空参数
            if (arg.trim().length === 0){ 
                shouldQuote = true;
            }
            
            //空格
            if (spaceCharRegex.test(arg)){
                shouldQuote = true;
            }
            
            //以数字开头的参数
            if (startsWithNumberRegex.test(arg)){ 
                shouldQuote = true;
            }
            
            //转义特殊符号
            if (specificCharGlobalRegex.test(arg)){ 
                arg = arg.replaceAll(specificCharGlobalRegex, "\\$1");
            }
            
            //如果需要引号，则添加引号
            if (shouldQuote){ 
                arg = `"${arg}"`;
            }
            params.push(arg);
        }
        return params.join(" ");
    }

    /**
     * execute a set of commands by sender
     * @param {AsyncCommandSender} sender 
     * @param {string[]} commands - command
     * @returns {Promise<CommandResult[]>}
     */
    static async postExecute(sender: AsyncCommandSender, commands: string[]): Promise<CommandResult[]> {
        commands = Array.from(commands);
        let promises = commands.map((cmd) => Command.fetchExecute(sender, cmd));
        let results = [];
        for (let pro of promises){
            results.push(await pro);
        }
        return Promise.all(results);
    }
    
    static run(command: string): CommandResult {
        if (!overworld.runCommand){
            throw new Error("current version doesn't support 'Command.run' method, try 'Command.fetch' instead");
        }
        return Command.execute(overworld, command);
    }
    static execute(sender: CommandSender, command: string): CommandResult {
        if (!sender.runCommand){
            throw new Error("not a command sender or current version doesn't support 'Command.execute' method, try 'Command.fetchExecute' instead");
        }
        let originalCommandResult: any;
        let isSuccess = false;
        try {
            originalCommandResult = sender.runCommand(command);
            isSuccess = true;
        } catch(cmderr) {
            originalCommandResult = cmderr;
        }
        return Command.generateCommandResult(isSuccess, originalCommandResult);
    }
    static generateCommandResult(isSuccess: boolean, value: any): CommandResult {
        // 反正最后返回的是 CommandResult
        
        let statusCode = isSuccess ? StatusCode.success: StatusCode.fail;
        let successCount = 0;
        let statusMessage = "command error";
        
        if (typeof value === "string"){
            try {
                value = JSON.parse(value);
            } catch {
            }
        }
        
        if (value?.statusCode !== undefined){
            statusCode = value.statusCode as unknown as StatusCode;
        }
        
        if (typeof value?.statusMessage === "string"){
            statusMessage = value.statusMessage;
        }
        
        if (typeof value?.successCount === "number"){
            successCount = value.successCount;
        }
        
        if (value instanceof Error){
            statusCode = StatusCode.fail;
            statusMessage = value.message;
        } else if (typeof value === "string"){
            statusMessage = value;
        } else if (typeof value === "number"){
            statusCode = value;
        }
        
        try {
            return Object.assign(({} as any), 
                value,
                {
                    successCount,
                    statusCode,
                    statusMessage,
                }
            );
        } catch {
            return {
                successCount,
                statusCode,
                statusMessage,
            };
        }
    }
}

