import { CommandQueueExecuteStatus } from "./CommandQueueExecuteStatus.js";
import { CommandResult } from "./CommandResult.js";
import { CommandSender } from "./CommandSender.js";

/**
 * contains command queue infos
 */
export class CommandQueue {
    sender: CommandSender;
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
    resolveResult(commandResult: any){
        if (this.#status === CommandQueueExecuteStatus.executing){
            this.#status = CommandQueueExecuteStatus.done;
            this.#result = commandResult;
            this.#resolveCallbacks.forEach(cb => cb(commandResult));
            this.#fulfilledCallbacks.forEach(cb => cb(commandResult));
        }
    }
    reject(err: any){
        if (this.#status === CommandQueueExecuteStatus.executing){
            this.#status = CommandQueueExecuteStatus.failed;
            this.#result = err;
            this.#fulfilledCallbacks.forEach(cb => cb(err));
            this.#rejectCallbacks.forEach(cb => cb(err));
        }
    }
    
    constructor(sender: CommandSender, command: string){
        if (typeof sender?.runCommand !== "function"){
            throw new TypeError("sender cannot runCommand()");
        }
        this.sender = sender;
        this.command = String(command);
    }
    #fulfilledCallbacks: ((result: any) => void)[] = [];
    #resolveCallbacks: ((result: any) => void)[] = [];
    #rejectCallbacks: ((result: any) => void)[] = [];
    onresolve(callback: (result: any) => void){
        this.#resolveCallbacks.push(callback);
    }
    onreject(callback: (result: any) => void){
        this.#rejectCallbacks.push(callback);
    }
    onfulfilled(callback: (result: any) => void){
        this.#fulfilledCallbacks.push(callback);
    }
}
