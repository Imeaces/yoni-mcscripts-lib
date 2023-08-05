import { MinecraftSystem as system } from "../basis.js";
import { AsyncCommandQueue } from "./AsyncCommandQueue.js";
import { CommandPriority } from "./CommandPriority.js";
import { CommandList } from "./CommandList.js";


export class AsyncCommandExecutor {
    static log(...data: any[]){
    }
    executingCommand: AsyncCommandQueue | null = null;
    commandList = new CommandList<AsyncCommandQueue>();
    start(){
        if (this.#scheduleId !== null)
            throw new Error("executor already started");
        this.#scheduleId = system.runInterval(this.#run.bind(this));
    }
    constructor(autoStart?: boolean){
        if (arguments.length > 0)
            if (autoStart)
                this.start();
    }
    #scheduleId: number | null = null;
    stop(){
        if (this.#scheduleId !== null){
            system.clearRun(this.#scheduleId);
            this.#scheduleId = null;
        }
    }
    add(priv: CommandPriority, command: AsyncCommandQueue){
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
            
            let commandPromise;
            const { sender, command } = commandQueue;
            try {
                commandPromise = sender.runCommandAsync(command);
            } catch(err) {
                if (commandQueue === lastFailedCommand){
                    //调用方法失败，并且上次也是这一条命令失败
                    
                    lastFailedCommand.reject(err);
                
                    AsyncCommandExecutor.log("队列中的命令执行失败 /{}\n",
                        lastFailedCommand.command, err);
                    
                    continue; //这种情况多半是因为 sender 无法使用，所以可以直接跳过这一条
                } else {
                    //不确定失败原因，可能是调用失败或者队列已满

                    AsyncCommandExecutor.log(
                        "队列已满或出现其他错误，"
                       +"如果下次该命令仍然推入错误，"
                       +"将会不执行此命令，"
                       +"已成功推入 {} 条命令，"
                       +"还有 {} 条正在等待\n",
                       executeQueueCount,
                       1 + this.commandList.count(), //lastFailedCommand 也还没执行
                       err);
                    
                    break; //这种情况可能是由于队列满了，所以应该结束本次命令循环
                }
            }
            
            //执行完成
            commandQueue.resolveResult(commandPromise);
            executeQueueCount += 1;
            this.executingCommand = null;
        }
    }
}
