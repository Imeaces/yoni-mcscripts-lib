/**
 * @interface
 * @typedef {{statusCode: number, successCount?: number}} CommandResult
 */
/**
 * something that can runCommandAsync
 * @interface
 * @typedef {{runCommandAsync: (command: string) => CommandResult}} CommandSender
 */
/**
 * contains command queue infos
 */
export declare class CommandQueue {
    /**
     * @type {CommandSender}
     */
    sender: any;
    /**
     * @type {string}
     */
    command: any;
    /**
     * @type {Function}
     */
    resolve: any;
    reject: any;
    /**
     * @param {Promise<CommandResult>} commandPromise
     */
    resolveResult(commandPromise: any): Promise<void>;
    /**
     *
     * @param {CommandSender} sender
     * @param {string} command
     * @param {Function} resolve
     * @param {Function} reject
     */
    constructor(sender: any, command: any, resolve: any, reject: any);
}
/**
 * Indicates the execution priority of this command
 * @typedef {number} CommandPriority
 */
export default class Command {
    /** @type {CommandPriority} */
    static PRIORITY_HIGHEST: number;
    /** @type {CommandPriority} */
    static PRIORITY_HIGH: number;
    /** @type {CommandPriority} */
    static PRIORITY_NORMAL: number;
    /** @type {CommandPriority} */
    static PRIORITY_LOW: number;
    /** @type {CommandPriority} */
    static PRIORITY_LOWEST: number;
    /**
     * 返回队列中未执行的命令的数量
     * @returns {number}
     */
    static countQueues(): number;
    /**
     * execute a command
     * @param {string} command
     */
    static fetch(command: any): Promise<unknown>;
    /**
     * execute a command with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(...params: any[]): Promise<unknown>;
    /**
     * execute a command with params by specific sender
     * @param {CommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender: any, ...params: any[]): Promise<unknown>;
    /**
     * execute a command by specific sender
     * @param {CommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender: any, command: any): Promise<unknown>;
    /**
     * add a command to specific priority to execute
     * @param {CommandPriority} priority
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static add(priority: any, command: any): Promise<unknown>;
    /**
     * add a command with params to specific priority to execute
     * @param {CommandPriority} priority
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addParams(priority: any, ...params: any[]): Promise<unknown>;
    /**
     * add a command with params to specific priority to execute by sender
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addExecuteParams(priority: any, sender: any, ...params: any[]): Promise<unknown>;
    /**
     *
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static addExecute(priority: any, sender: any, command: any): Promise<unknown>;
    /**
     * get command by params
     * @param {string} command
     * @param  {...string} args - command params
     * @returns {string} command
     */
    static getCommand(command: any, ...args: any[]): any;
    static getCommandMoreStrict(...args: any[]): any;
    /**
     * execute a set of commands by sender
     * @param {CommandSender} sender
     * @param {string[]} commands - command
     * @returns {Promise<CommandResult[]>}
     */
    static postExecute(sender: any, commands: any): Promise<never[]>;
    static run(command: any): any;
    static execute(sender: any, command: any): any;
}
export { Command };
