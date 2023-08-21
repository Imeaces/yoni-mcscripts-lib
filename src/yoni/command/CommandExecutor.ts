import { CommandQueue } from "./CommandQueue.js";
import { CommandPriority } from "./CommandPriority.js";
import { CommandList } from "./CommandList.js";
import { clearRun, runInterval } from "../legacy_impl.js";

export class CommandExecutor {
    static log(...data: any[]){
    }
    executingCommand: CommandQueue | null = null;
    commandList = new CommandList<CommandQueue>();
    constructor(autoStart?: boolean){
        if (arguments.length > 0)
            if (autoStart)
                this.start();
    }
    start(){
        if (this.#scheduleId !== null)
            throw new Error("executor already started");
        this.#scheduleId = runInterval(this.#run.bind(this));
    }
    #scheduleId: number | null = null;
    stop(){
        if (this.#scheduleId !== null){
            clearRun(this.#scheduleId);
            this.#scheduleId = null;
        }
    }
    add(priv: CommandPriority, command: CommandQueue){
        this.commandList.add(priv, command);
    }
    #run(){
        let executeQueueCount = 0;
        while (this.commandList.hasNext()
        || this.executingCommand !== null){
            let commandQueue = this.executingCommand ?? this.commandList.next();
            
            executeQueueCount += 1;
            
            //如果executingCommand不为null，说明上次执行的时候可能出现了什么错误
            //保存以便于后边处理的时候给出更多结果
            let lastFailedCommand;
            if (this.executingCommand !== null)
                lastFailedCommand = commandQueue;
            else
                lastFailedCommand = null;
            
            //开始执行，保存正在执行的命令
            this.executingCommand = commandQueue;
            
            let commandResult;
            const { sender, command } = commandQueue;
            try {
                commandResult = sender.runCommand(command);
            } catch(err) { //鬼知道什么原因导致的错误，直接扔回去
                commandQueue.reject(err);
            }
            
            //执行完成
            //也可能没执行成功
            //不过反正再调用一次也不影响（目前）
            commandQueue.resolveResult(commandResult);
            executeQueueCount += 1;
            this.executingCommand = null;
        }
    }
}
