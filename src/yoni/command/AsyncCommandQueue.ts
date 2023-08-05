import { CommandQueueExecuteStatus } from "./CommandQueueExecuteStatus.js";
import { AsyncCommandSender } from "./AsyncCommandSender.js";
import { CommandResult } from "./CommandResult.js";

export class AsyncCommandQueue {
    sender: AsyncCommandSender;
    command: string;
    #status: CommandQueueExecuteStatus = CommandQueueExecuteStatus.executing;
    get status(): CommandQueueExecuteStatus {
        return this.#status;
    }
    #result: any;
    get result(): any {
        if (this.status === CommandQueueExecuteStatus.executing)
            throw new Error("command executing have not been done");
        
        return this.#result;
    }
    async resolveResult(commandResult: Promise<any>) {
        if (this.#status !== CommandQueueExecuteStatus.executing){
            return;
        }
        
        try {
            this.#result = await commandResult;
            this.#status = CommandQueueExecuteStatus.done;
        } catch(err){
            this.reject(err);
            this.#status = CommandQueueExecuteStatus.failed;
        }
        
        if (this.#status === CommandQueueExecuteStatus.done)
            this.#resolveCallback(this.result);
        else
            this.#rejectCallback(this.result);
    }
    reject(err: any){
        if (this.status === CommandQueueExecuteStatus.executing){
            this.#status = CommandQueueExecuteStatus.failed;
            this.#result = err;
        }
    }
    
    #resolveCallback: (commandResult: CommandResult) => void;
    #rejectCallback: (err?: any) => void;
    
    constructor(sender: AsyncCommandSender, command: string,
        resolve: (commandResult: CommandResult) => void,
        reject: (err?: any) => void){
        
        if (typeof sender?.runCommandAsync !== "function"){
            throw new TypeError("sender cannot runCommandAsync()");
        }
        this.sender = sender;
        this.command = String(command);
        this.#resolveCallback = resolve;
        this.#rejectCallback = reject;
    }
}
