import { StatusCode, Minecraft } from "./basis.js";
/**
 * 表示命令完成执行后返回的结果。
 * @interface
 * @typedef CommandResult
 * @prop {number} statusCode
 * @prop {number} [successCount]
 * @prop {string} [statusMessage]
 */
export interface CommandResult {
    statusCode: StatusCode;
    successCount?: number;
    statusMessage?: string;
}
/**
 * 某些拥有 `runCommandAsync` 方法的对象。
 * @interface
 * @typedef {{runCommandAsync: (command: string) => CommandResult}} CommandSender
 */
export interface CommandSender {
    runCommandAsync(command: string): Promise<CommandResult> | Promise<Minecraft.CommandResult>;
}
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
 * 命令运行的优先级。
 * Indicates the execution priority of this command
 * @typedef {5 | 4 | 3 | 2 | 1} CommandPriority
 */
export declare type CommandPriority = 5 | 4 | 3 | 2 | 1;
export default class Command {
    /** @type {CommandPriority} */
    static PRIORITY_HIGHEST: CommandPriority;
    /** @type {CommandPriority} */
    static PRIORITY_HIGH: CommandPriority;
    /** @type {CommandPriority} */
    static PRIORITY_NORMAL: CommandPriority;
    /** @type {CommandPriority} */
    static PRIORITY_LOW: CommandPriority;
    /** @type {CommandPriority} */
    static PRIORITY_LOWEST: CommandPriority;
    /**
     * 返回队列中未执行的命令的数量
     * @returns {number}
     */
    static countQueues(): number;
    /**
     * execute a command
     * @param {string} command
     */
    static fetch(command: any): Promise<CommandResult>;
    /**
     * execute a command with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(...params: any[]): Promise<CommandResult>;
    /**
     * execute a command with params by specific sender
     * @param {CommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender: any, ...params: any[]): Promise<CommandResult>;
    /**
     * execute a command by specific sender
     * @param {CommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender: any, command: any): Promise<CommandResult>;
    /**
     * add a command to specific priority to execute
     * @param {CommandPriority} priority
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static add(priority: CommandPriority, command: string): Promise<CommandResult>;
    /**
     * add a command with params to specific priority to execute
     * @param {CommandPriority} priority
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addParams(priority: CommandPriority, ...params: string[]): Promise<CommandResult>;
    /**
     * add a command with params to specific priority to execute by sender
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addExecuteParams(priority: CommandPriority, sender: any, ...params: any[]): Promise<CommandResult>;
    /**
     * 在对象上调用 `runCommandAsync` 执行命令。
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static addExecute(priority: CommandPriority, sender: CommandSender, command: string): Promise<CommandResult>;
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
    static postExecute(sender: any, commands: any): Promise<any[]>;
    static run(command: any): any;
    static execute(sender: any, command: any): any;
}
export { Command };
