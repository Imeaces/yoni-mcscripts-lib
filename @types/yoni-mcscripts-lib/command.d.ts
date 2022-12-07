/**
 * @interface
 * @typedef {CommandResult}
 * @property {number} statusCode
 * @property {number} [successCount]
 */
/**
 * something that can runCommandAsync
 * @interface
 * @typedef {CommandSender}
 * @peoperty {Function} runCommandAsync - a method that execute command on the object
 */
/**
 * contains command queue infos
 */
export class CommandQueue {
    /**
     *
     * @param {CommandSender} sender
     * @param {string} command
     * @param {Function} resolve
     * @param {Function} reject
     */
    constructor(sender: CommandSender, command: string, resolve: Function, reject: Function);
    /**
     * @type {CommandSender}
     */
    sender: CommandSender;
    /**
     * @type {string}
     */
    command: string;
    /**
     * @type {Function}
     */
    resolve: Function;
    reject: Function;
    /**
     * @param {Promise<CommandResult>} commandPromise
     */
    resolveResult(commandPromise: Promise<CommandResult>): Promise<void>;
}
/**
 * Indicates the execution priority of this command
 * @typedef {number} CommandPriority
 */
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
    static fetch(command: string): Promise<CommandResult>;
    /**
     * execute a command with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(...params: string[]): Promise<CommandResult>;
    /**
     * execute a command with params by specific sender
     * @param {CommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender: CommandSender, ...params: string[]): Promise<CommandResult>;
    /**
     * execute a command by specific sender
     * @param {CommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender: CommandSender, command: any): Promise<CommandResult>;
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
    static addExecuteParams(priority: CommandPriority, sender: CommandSender, ...params: string[]): Promise<CommandResult>;
    /**
     *
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
    static getCommand(command: string, ...args: string[]): string;
    /**
     * execute a set of commands by sender
     * @param {CommandSender} sender
     * @param {string[]} commands - command
     * @returns {Promise<CommandResult[]]>}
     */
    static postExecute(sender: CommandSender, commands: string[]): Promise<CommandResult[]>;
}
/**
 * Indicates the execution priority of this command
 */
export type CommandPriority = number;
