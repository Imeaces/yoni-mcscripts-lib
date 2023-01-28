// @ts-nocheck
/*
    "authors": [
      "Silvigarabis"
    ],
    "license": "MIT LICENSE",
    "url": "https://github.com/Silvigarabis/yoni-mcscripts-lib"

测试版本：1.19.50, 1.19.30
    你知道吗，这里的代码实际上只有25KB是有用的，其他都是空行和注释。
导出语句在最底下，可以在那里查看可用的类型
同时，几乎所有方法都添加了注释

MIT License

Copyright (c) 2022 Silvigarabis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
//1.19.40应该导入这个
import * as Minecraft from "@minecraft/server";
//1.19.30应该导入这个
//import * as Minecraft from "mojang-minecraft";
/* config.js */
//如果为true，启用一些可能可以加快运行速度的代码
//（可能不够稳定）
const useOptionalFasterCode = false;
/* basis.js */
const VanillaWorld = Minecraft.world;
const VanillaEvents = VanillaWorld.events;
const VanillaScoreboard = VanillaWorld.scoreboard;
const MinecraftSystem = Minecraft.system;
/**
 * @param {(...args) => void} callback
 * @param {...any} args
 */
const runTask = (callback, ...args) => {
    if (MinecraftSystem.run) {
        MinecraftSystem.run(callback, ...args);
    }
    else {
        const runTask = () => {
            VanillaEvents.tick.unsubscribe(runTask);
            callback(...args);
        };
        VanillaEvents.tick.subscribe(runTask);
    }
};
/**
 * overworld dimension
 * @type {Minecraft.Dimension}
 */
const overworld = VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.overworld);
/**
 * a type contains a set of statusCode
 */
class StatusCode {
    static fail = -2147483648;
    static error = -2147483646;
    static success = 0;
}
/**
 * 返回一个维度对象
 * @param {string|Minecraft.Dimension|number} dimid - something means a dimension
 * @returns {Minecraft.Dimension} dimension objective
 */
let dim = (dimid = 0) => {
    if (dimid instanceof Minecraft.Dimension)
        return dimid;
    switch (dimid) {
        case 0:
        case "overworld":
        case Minecraft.MinecraftDimensionTypes.overworld:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.overworld);
        case -1:
        case "nether":
        case Minecraft.MinecraftDimensionTypes.nether:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.nether);
        case 1:
        case "the end":
        case "theEnd":
        case "the_end":
        case Minecraft.MinecraftDimensionTypes.theEnd:
            return VanillaWorld.getDimension(Minecraft.MinecraftDimensionTypes.theEnd);
        default:
            try {
                return VanillaWorld.getDimension(dimid);
            }
            catch {
                return dim(0);
            }
    }
};
/* command.js */
/**
 * generates a command by a set of params, and try to make sure that every arg is standalone
 * @param {string} cmd
 * @param  {string[]|...string} args
 * @returns {string} command
 */
function getCommand(cmd, ...args) {
    if (args?.length === 1 && Array.isArray(args[0])) {
        args = args[0];
    }
    if (args.length !== 0) {
        //遍历每个参数，对满足某一条件的参数进行处理
        args.forEach((arg) => {
            let shouldQuote = false; //标记是否应当在两侧添加引号
            arg = String(arg);
            if (arg.trim().length === 0) { //空参数
                shouldQuote = true;
            } /* else if (getCommand.startsWithNumberRegex.test(arg)){ //以数字开头的参数
                shouldQuote = true;
            }*/
            else if (getCommand.spaceCharRegex.test(arg)) { //含有空格，需要引号括起
                shouldQuote = true;
            }
            if (getCommand.specificCharRegex.test(arg)) { //将特殊符号转义
                arg = arg.replaceAll(getCommand.specificCharGlobalRegex, "\\$1");
            }
            if (shouldQuote) { //如果需要引号，则添加引号
                arg = `"${arg}"`;
            }
            cmd += ` ${arg}`; //将参数字符串拼接到命令
        });
    }
    return cmd;
}
function getCommandMoreStrict(cmd, ...args) {
    if (args?.length === 1 && Array.isArray(args[0])) {
        args = args[0];
    }
    if (args.length !== 0) {
        //遍历每个参数，对满足某一条件的参数进行处理
        args.forEach((arg) => {
            let shouldQuote = false; //标记是否应当在两侧添加引号
            arg = String(arg);
            if (arg.trim().length === 0) { //空参数
                shouldQuote = true;
            }
            else if (getCommand.startsWithNumberRegex.test(arg)) { //以数字开头的参数
                shouldQuote = true;
            }
            else if (getCommand.spaceCharRegex.test(arg)) { //含有空格，需要引号括起
                shouldQuote = true;
            }
            if (getCommand.specificCharRegex.test(arg)) { //将特殊符号转义
                arg = arg.replaceAll(getCommand.specificCharGlobalRegex, "\\$1");
                shouldQuote = true;
            }
            if (shouldQuote) { //如果需要引号，则添加引号
                arg = `"${arg}"`;
            }
            cmd += ` ${arg}`; //将参数字符串拼接到命令
        });
    }
    return cmd;
}
//因为不globle没法replaceAll
getCommand.specificCharGlobalRegex = /(["'\\])/g;
getCommand.specificCharRegex = /(["'\\])/;
getCommand.spaceCharRegex = /(\s)/;
getCommand.startsWithNumberRegex = /^[0-9]/;
let commandQueues = [[], [], [], [], []];
//空间换时间（滑稽）
/** @returns {boolean} */
function hasNextQueue() {
    if (commandQueues[4].length
        || commandQueues[3].length
        || commandQueues[2].length
        || commandQueues[1].length
        || commandQueues[0].length) {
        return true;
    }
    return false;
}
/** @returns {number} */
function countNextQueues() {
    return commandQueues[4].length
        + commandQueues[3].length
        + commandQueues[2].length
        + commandQueues[1].length
        + commandQueues[0].length;
}
/** @returns {CommandQueue} */
function fetchNextQueue() {
    if (commandQueues[4].length) {
        return commandQueues[4][0];
    }
    if (commandQueues[3].length) {
        return commandQueues[3][0];
    }
    if (commandQueues[2].length) {
        return commandQueues[2][0];
    }
    if (commandQueues[1].length) {
        return commandQueues[1][0];
    }
    if (commandQueues[0].length) {
        return commandQueues[0][0];
    }
}
/** remove next queue */
function removeNextQueue() {
    if (commandQueues[4].length) {
        commandQueues[4].shift();
    }
    else if (commandQueues[3].length) {
        commandQueues[3].shift();
    }
    else if (commandQueues[2].length) {
        commandQueues[2].shift();
    }
    else if (commandQueues[1].length) {
        commandQueues[1].shift();
    }
    else if (commandQueues[0].length) {
        commandQueues[0].shift();
    }
}
/** @type {CommandQueue} */
let lastFailedCommand = null;
function executeCommandQueues() {
    runTask(executeCommandQueues);
    let executeQueueCount = 0;
    while (hasNextQueue()) {
        //从队列plus中取得一个排队中的命令
        let commandQueue = fetchNextQueue();
        //然后将命令送入minecraft 的命令队列
        try {
            let p = commandQueue.sender.runCommandAsync(commandQueue.command);
            commandQueue.resolveResult(p);
        }
        catch (error) { //如果没送入成功，说明minecraft 命令队列已满(也可能你故意传了个用不了的sender)，结束等待下次开始
            if (commandQueue === lastFailedCommand) {
                lastFailedCommand.reject(error);
                removeNextQueue();
                log("队列中的命令执行失败 /{}\n{}", lastFailedCommand.command, error);
            }
            else {
                log("队列已满或出现其他错误，如果下次该命令仍然推入错误，将会不执行此命令，已成功推入 {} 条命令，还有 {} 条正在等待\n{}", executeQueueCount, countNextQueues(), error);
                lastFailedCommand = commandQueue;
            }
            break;
        }
        executeQueueCount += 1;
        //送入之后将队列中的命令移除
        removeNextQueue();
    }
}
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
class CommandQueue {
    /**
     * @type {CommandSender}
     */
    sender;
    /**
     * @type {string}
     */
    command;
    /**
     * @type {Function}
     */
    resolve;
    reject;
    /**
     * @param {Promise<CommandResult>} commandPromise
     */
    async resolveResult(commandPromise) {
        //然后是获取命令结果(但是现在已经没有结果了)
        //所以只好生成一个
        let commandResult = { statusCode: StatusCode.success };
        let rt = null;
        try {
            rt = await commandPromise;
        }
        catch (commmandExecuteErrorMessage) {
            commandResult.statusCode = StatusCode.error;
            commandResult.statusMessage = String(commmandExecuteErrorMessage);
        }
        try {
            if (rt != null) {
                for (let key in rt) {
                    if (key in commandResult) {
                        continue;
                    }
                    commandResult[key] = rt[key];
                }
            }
        }
        catch (e) { //在commandResult出现问题的时候大概会触发这段代码
            log("在复制属性的时候出现错误: {}", e);
        }
        this.resolve(commandResult);
    }
    /**
     *
     * @param {CommandSender} sender
     * @param {string} command
     * @param {Function} resolve
     * @param {Function} reject
     */
    constructor(sender, command, resolve, reject) {
        if (typeof sender?.runCommandAsync !== "function") {
            throw new TypeError("sender cannot runCommandAsync()");
        }
        this.sender = sender;
        this.command = command;
        this.resolve = resolve;
        this.reject = reject;
    }
}
/**
 * Indicates the execution priority of this command
 * @typedef {number} CommandPriority
 */
class Command {
    /** @type {CommandPriority} */
    static PRIORITY_HIGHEST = 5;
    /** @type {CommandPriority} */
    static PRIORITY_HIGH = 4;
    /** @type {CommandPriority} */
    static PRIORITY_NORMAL = 3;
    /** @type {CommandPriority} */
    static PRIORITY_LOW = 2;
    /** @type {CommandPriority} */
    static PRIORITY_LOWEST = 1;
    /**
     * 返回队列中未执行的命令的数量
     * @returns {number}
     */
    static countQueues() {
        return countNextQueues();
    }
    /**
     * execute a command
     * @param {string} command
     */
    static fetch(command) {
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, command);
    }
    /**
     * execute a command with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(...params) {
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, getCommand(...params));
    }
    /**
     * execute a command with params by specific sender
     * @param {CommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender, ...params) {
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, getCommand(...params));
    }
    /**
     * execute a command by specific sender
     * @param {CommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender, command) {
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, command);
    }
    /**
     * add a command to specific priority to execute
     * @param {CommandPriority} priority
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static add(priority, command) {
        return Command.addExecute(priority, overworld, command);
    }
    /**
     * add a command with params to specific priority to execute
     * @param {CommandPriority} priority
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addParams(priority, ...params) {
        return Command.addExecute(priority, overworld, getCommand(...params));
    }
    /**
     * add a command with params to specific priority to execute by sender
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addExecuteParams(priority, sender, ...params) {
        return Command.addExecute(priority, sender, getCommand(...params));
    }
    //某些命令需要以尽可能快的速度执行，故添加此函数，可设置命令权重
    //然后我就把所有命令都用这个来执行了
    /**
     *
     * @param {CommandPriority} priority
     * @param {CommandSender} sender
     * @param {string} command
     * @returns {Promise<CommandResult>}
     */
    static addExecute(priority, sender, command) {
        let resolve, reject;
        let promise = new Promise((re, rj) => {
            resolve = re;
            reject = rj;
        });
        if (priority - 1 in commandQueues) {
            commandQueues[priority - 1].push(new CommandQueue(sender, command, resolve, reject));
            return promise;
        }
        else {
            throw new Error("Unknown command priority " + String(priority));
        }
    }
    /**
     * get command by params
     * @param {string} command
     * @param  {...string} args - command params
     * @returns {string} command
     */
    static getCommand(command, ...args) {
        return getCommand(command, ...args);
    }
    static getCommandMoreStrict(...args) {
        return getCommandMoreStrict(...args);
    }
    /**
     * execute a set of commands by sender
     * @param {CommandSender} sender
     * @param {string[]} commands - command
     * @returns {Promise<CommandResult[]>}
     */
    static async postExecute(sender, commands) {
        commands = Array.from(commands);
        let promises = commands.map((cmd) => Command.fetchExecute(sender, cmd));
        let results = [];
        for (let pro of promises) {
            results.push(await pro);
        }
        return Promise.all(results);
    }
    static run(command) {
        if (overworld.runCommand) {
            try {
                return Object.assign({}, overworld.runCommand(command));
            }
            catch (e) {
                return JSON.parse(e);
            }
        }
        throw new Error("current version doesn't support 'Command.run' method, try 'Command.fetch' instead");
    }
    static execute(sender, command) {
        if (sender.runCommand) {
            try {
                return Object.assign({}, sender.runCommand(command));
            }
            catch (e) {
                return JSON.parse(e);
            }
        }
        throw new Error("current version doesn't support 'Command.execute' method, try 'Command.fetchExecute' instead");
    }
}
runTask(executeCommandQueues);
/* Entry.js */
let idRecords = new Map();
let nameRecords = new Map();
let entityRecords = new WeakMap();
let scbidRecords = new WeakMap();
/** @enum {En} */
const EntryType = {
    PLAYER: Minecraft.ScoreboardIdentityType.player,
    ENTITY: Minecraft.ScoreboardIdentityType.entity,
    FAKE_PLAYER: Minecraft.ScoreboardIdentityType.fakePlayer
};
/**
 * @interface
 * @typedef EntryOption
 * @property {string} [name]
 * @property {number} [id]
 * @property {Minecraft.ScoreboardIdentity} [scbid]
 * @property {Minecraft.Entity|Minecraft.Player} [entity]
 * @property {EntryType} [type]
 */
/**
 * Contains an identity of the scoreboard item.
 */
class Entry {
    /**
     * 从可能为分数持有者的值获取其对象。
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} any - 可能为分数持有者的值
     * @returns {Entry} 与 `any` 对应的分数持有者对象。
     * @throws {UnknownEntryError} 若未能根据值得到可能的分数持有者对象。
     */
    static guessEntry(any) {
        if (any instanceof Minecraft.ScoreboardIdentity)
            return this.getEntry({ scbid: any });
        if (any instanceof Minecraft.Entity || any instanceof Minecraft.Player)
            return this.getEntry({ entity: any });
        if (typeof any === "string")
            return this.getEntry({ name: any, type: EntryType.FAKE_PLAYER });
        if (!isNaN(Number(any)))
            return this.getEntry({ id: any });
        throw new UnknownEntryError();
    }
    /**
     * 根据 `option` 接口获得分数持有者对象。
     * @param {EntryOption} option
     * @returns {Entry}
     */
    static getEntry(option) {
        let { entity, id, name, scbid, type } = option;
        let entry;
        if (type === EntryType.FAKE_PLAYER && scbid !== undefined)
            name = scbid.displayName;
        //优先级: entity, scbid, id, name
        if (type !== EntryType.FAKE_PLAYER && entityRecords.has(entity))
            entry = entityRecords.get(entity);
        else if (type === EntryType.FAKE_PLAYER && nameRecords.has(name))
            entry = nameRecords.get(name);
        else if (scbidRecords.has(scbid))
            entry = scbidRecords.get(scbid);
        else if (idRecords.has(id))
            entry = idRecords.get(id);
        else
            entry = new Entry(option);
        if (type != null && entry.type !== type)
            throw new Error("entry type do not matches");
        if (type !== EntryType.FAKE_PLAYER && entry.getVanillaEntity() != null)
            entityRecords.set(entry.getVanillaEntity(), entry);
        if (entry.id !== undefined)
            idRecords.set(entry.id, entry);
        if (entry.vanillaScbid !== undefined)
            scbidRecords.set(entry.vanillaScbid, entry);
        if (type === EntryType.FAKE_PLAYER && entry.displayName !== undefined)
            nameRecords.set(entry.displayName, entry);
        return entry;
    }
    /**
     * 根据 `option` 获得原始分数持有者对象（需要启用 `useOptionalFasterCode`）。
     * @function getVanillaScoreboardParticipant
     * @param {EntryOption} option
     * @returns {Minecraft.ScoreboardIdentity}
     */
    static getVanillaScoreboardParticipant() {
        throw new Error("To use this function, you have to enable 'useOptionalFasterCode' in the config");
    }
    #type;
    #id;
    #name;
    #vanillaScbid;
    #entity;
    /**
     * 分数持有者的类型
     * @returns {EntryType}
     */
    get type() {
        return this.#type;
    }
    /**
     * 分数持有者的标识符
     * @returns {number}
     */
    get id() {
        if (this.vanillaScbid?.id !== this.#id)
            this.#id = this.vanillaScbid?.id;
        return this.#id;
    }
    /**
     * 一个“玩家可见的”名称
     * @returns {string}
     */
    get displayName() {
        if (this.vanillaScbid !== undefined && this.#vanillaScbid.displayName !== undefined)
            return this.vanillaScbid.displayName;
        if (this.#type == EntryType.PLAYER)
            return this.#entity.name;
        if (this.#type == EntryType.ENTITY)
            return this.id;
        if (this.#type === EntryType.FAKE_PLAYER)
            return this.#name;
    }
    /**
     * 原始分数持有者对象，可能为空。
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid() {
        if ((this.#type === EntryType.PLAYER || this.#type === EntryType.ENTITY)
            && this.#entity.scoreboard !== this.#vanillaScbid)
            this.#vanillaScbid = this.#entity.scoreboard;
        if (this.#vanillaScbid !== undefined && scbidRecords.get(this.#vanillaScbid) !== this)
            scbidRecords.set(this.#vanillaScbid, this);
        return this.#vanillaScbid;
    }
    /**
     * 如果此分数持有者不是虚拟玩家，返回此分数持有者对应实体的对象。
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity() {
        return this.getVanillaEntity();
    }
    /**
     * If the scoreboard identity is an entity or player, returns
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     */
    getVanillaEntity() {
        if (this.#type === EntryType.FAKE_PLAYER)
            this.#entity = null;
        else if (this.#entity === null)
            this.#entity = this.vanillaScbid.getEntity();
        return this.#entity;
    }
    /**
     * 更新此分数持有者对象与原始分数持有者对象的映射关系。
     * @returns {Entry} 更新完成后，返回对象自身。
     */
    update() {
        if (this.#type === EntryType.FAKE_PLAYER) {
            this.#vanillaScbid = undefined;
            for (let s of VanillaScoreboard.getParticipants()) {
                if (s.displayName === this.#name && s.type === this.#type) {
                    this.#vanillaScbid = s;
                    break;
                }
            }
        }
        else {
            //使用getter重新初始化变量
            let i = this.vanillaScbid;
        }
        return this;
    }
    /**
     * @hideconstructor
     */
    constructor(option) {
        let { entity, name, id, scbid, type } = option;
        if (entity !== undefined) {
            //if (entity instanceof Minecraft.Player || entity instanceof Gametest.SimulatedPlayer)
            if (entity instanceof Minecraft.Player)
                type = EntryType.PLAYER;
            else if (entity instanceof Minecraft.Entity)
                type = EntryType.ENTITY;
            else
                throw new TypeError("Unknown entity type");
            scbid = entity.scoreboard;
            id = scbid?.id;
        }
        else {
            if (useOptionalFasterCode) {
                scbid = Entry.getVanillaScoreboardParticipant(option);
            }
            else {
                let condF = null;
                if (type === EntryType.FAKE_PLAYER && name !== "" && name !== scbid?.displayName) {
                    condF = (scbid) => {
                        return (scbid.displayName === name && type === scbid.type);
                    };
                }
                else if (id !== undefined && scbid === undefined) {
                    condF = (scbid) => {
                        return scbid.id === id;
                    };
                }
                if (condF !== null) {
                    scbid = undefined;
                    for (let s of VanillaScoreboard.getParticipants()) {
                        if (condF(s)) {
                            scbid = s;
                            break;
                        }
                    }
                }
            }
            if (scbid !== undefined) {
                type = scbid.type;
                name = scbid.displayName;
                id = scbid.id;
                if (type !== EntryType.FAKE_PLAYER) {
                    entity = null;
                    try {
                        entity = scbid.getEntity();
                    }
                    catch {
                        entity = null;
                    }
                }
            }
            else if (id !== undefined) {
                throw new Error(`Unable to determine the scbid ${id}`);
            }
        }
        this.#id = id;
        this.#entity = entity;
        this.#name = name;
        this.#type = type;
        this.#vanillaScbid = scbid;
    }
}
if (useOptionalFasterCode) {
    //缓存分数持有者映射
    (async function () {
        //5t后，开始每10t运行一次cacheEntryTask，异步
        //源代码中由Scheduler实现，但是它太大了，而且不是必须的，所以没放进来。
        let interval = 50;
        let isRunning = false;
        let timerTask = function () {
            runTask(timerTask);
            if (isRunning) {
                return;
            }
            interval -= 1;
            if (interval <= 0) {
                isRunning = true;
                interval = 10;
                runTask(runCacheEntryTask);
            }
        };
        let cacheEntryTask = async function () {
            for (let scbid of VanillaScoreboard.getParticipants()) {
                Entry.getEntry({ scbid: scbid, id: scbid.id, type: scbid.type }); //to cache entry result
                await 1; //pause async function
            }
        };
        let runCacheEntryTask = function () {
            cacheEntryTask().finally(() => {
                isRunning = false;
            });
        };
    })();
    //使用getVanillaScoreboardParticipant获取scbid
    (function () {
        let cacheTimeout = 500;
        let parts;
        let lastCacheTime = -1;
        let entityRecords;
        let idRecords;
        let nameRecords;
        const updateCache = () => {
            entityRecords = new WeakMap();
            idRecords = new Map();
            nameRecords = new Map();
            lastCacheTime = Date.now();
            parts = VanillaScoreboard.getParticipants();
            for (let part of parts) {
                idRecords.set(part.id, part);
                if (part.type !== EntryType.FAKE_PLAYER) {
                    try {
                        entityRecords.set(part.getEntity(), part);
                    }
                    catch {
                    }
                }
                else {
                    nameRecords.set(part.displayName, part);
                }
            }
        };
        Entry.getVanillaScoreboardParticipant = function getVanillaScoreboardParticipant(option) {
            if (Date.now() - lastCacheTime > cacheTimeout) {
                updateCache();
            }
            let { type, entity, id, name, scbid } = option;
            if (scbid instanceof Minecraft.ScoreboardIdentity)
                return scbid;
            //entity not null, type not fakeplayer
            if (entity && (type && type !== EntryType.FAKE_PLAYER || !type)) {
                scbid = entityRecords.get(entity);
            }
            //name not null, scbid is null, type is faleplayer or null
            if (!scbid && name && (type && type === EntryType.FAKE_PLAYER || !type)) {
                scbid = nameRecords.get(name);
            }
            //name not null, scbid is null, type is null
            if (!scbid && id != null) {
                scbid = idRecords.get(name);
                if (type && scbid.type !== type)
                    scbid = null;
            }
            return scbid;
        };
    })();
}
/* ScoreboardError.js */
/**
 * 错误：值不能作为分数。
 */
class ScoreRangeError extends RangeError {
    name = "ScoreRangeError";
    message = "Score must be an integer and must in range of [-2147483648, 2147483647].";
}
/**
 * 错误：记分项已从记分板上移除。
 */
class ObjectiveUnregisteredError extends Error {
    name = "ObjectiveUnregisteredError";
    constructor(name) {
        super(`Objective ${name} has been unregistered.`);
    }
}
/**
 * 错误：虚拟玩家名称与游戏中正在游玩的玩家拥有相同的名字，无法为虚拟玩家设置分数。
 */
class NameConflictError extends Error {
    name = "NameConflictError";
    constructor(name) {
        super(`Could not set score because there are name conflict! More than one ${name}`);
    }
}
/**
 * 错误：无法从可能的记分持有者的值得到记分持有者对象。
 */
class UnknownEntryError extends Error {
    name = "UnknownEntryError";
    message = "Unknown scoreboard entry.";
}
/* SimpleScoreboard.js */
/**
 * 可用的显示位。
 * @enum
 */
const DisplaySlot = {
    /**
     * 在暂停菜单中显示。
     */
    list: "list",
    /**
     * 在屏幕右侧显示。
     */
    sidebar: "sidebar",
    /**
     * 在玩家名字下方显示。
     */
    belowname: "belowname",
};
/**
 * 记分项中每条项目的排序方式。
 * @enum
 */
const ObjectiveSortOrder = {
    /**
     * 以正序排列项目（A-Z）。
     */
    "ascending": "ascending",
    /**
     * 以倒序排列项目（Z-A）。
     */
    "descending": "descending",
};
/**
 * 描述了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptions
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective} objective - 显示的记分项。
 */
/**
 * 定义了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptionsDefines
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 显示的记分项。
 */
/**
 * 记分板包括了记分项，分数持有者以及他们的分数。
 */
class SimpleScoreboard {
    /**
     * @type {Map<string, Objective>}
     */
    static #objectives = new Map();
    /**
     * 在记分板上添加新的记分项。
     * @param {string} name - 新的记分项的名称（标识符）。
     * @param {string} criteria - 记分项的准则，永远都是 `"dummy"` 。
     * @param {string} [displayName] - 为新添加的记分项指定显示名称，
     * 若不指定则将 `name` 作为显示名称。
     * @returns {Objective} 添加的记分项的对象。
     * @throws 若准则不为 `"dummy"` ，抛出错误。
     * @throws 若 `name` 指定的记分项已经存在，抛出错误。
     */
    static addObjective(name, criteria = "dummy", displayName = name) {
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        if (this.getObjective(name) !== null)
            throw new Error("Objective " + name + " existed!");
        if (criteria !== "dummy")
            throw new Error("Unsupported criteria: " + criteria);
        if (!name || typeof name !== "string")
            throw new TypeError("Objective display name not valid!");
        let vanillaObjective = VanillaScoreboard.addObjective(name, displayName);
        let newObjective = new Objective({
            scoreboard: this,
            name, criteria, displayName,
            vanillaObjective
        });
        this.#objectives.set(name, newObjective);
        return newObjective;
    }
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，
     * 字符串将作为记分项的标识符。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(nameOrObjective) {
        let objectiveId;
        if (nameOrObjective instanceof Objective || nameOrObjective instanceof Minecraft.ScoreboardObjective) {
            objectiveId = nameOrObjective.id;
        }
        else {
            objectiveId = nameOrObjective;
        }
        if (objectiveId && typeof objectiveId === "string") {
            if (this.#objectives.has(objectiveId)) {
                this.#objectives.delete(objectiveId);
            }
            try {
                return VanillaScoreboard.removeObjective(objectiveId);
            }
            catch {
                return false;
            }
        }
        else {
            throw new TypeError("unknown error while removing objective");
        }
    }
    /**
     * 获得记分项对象。
     * @param {string|Minecraft.ScoreboardObjective} name - 可以得到对应记分项的值。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns {Objective|null} 若不存在由 `name` 指定的记分项，返回 `null` 。
     */
    static getObjective(name, autoCreateDummy = false) {
        let result = null;
        if (name instanceof Minecraft.ScoreboardObjective) {
            name = name.id;
        }
        let record = this.#objectives.get(name);
        let vanillaObjective = VanillaScoreboard.getObjective(name);
        if (vanillaObjective == null && autoCreateDummy) {
            vanillaObjective = VanillaScoreboard.addObjective(name, name);
        }
        //这种条件下，不会将记录的结果作为返回值
        if (record == null || record.isUnregistered()) {
            //这种情况下，会创建对应的记分项对象，不可以合并判断条件
            if (vanillaObjective != null) {
                result = new Objective(this, name, "dummy", vanillaObjective.displayName, vanillaObjective);
                this.#objectives.set(name, result);
            }
        }
        else {
            result = record;
        }
        return result;
    }
    /**
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives() {
        return Array.from(VanillaScoreboard.getObjectives())
            .map(obj => this.getObjective(obj.id));
    }
    /**
     * 获得显示位上正在显示的内容的信息。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {DisplayOptions} - 显示位上显示的内容。
     */
    static getDisplayAtSlot(slot) {
        let rt = VanillaScoreboard.getObjectiveAtDisplaySlot(slot);
        let result = {
            objective: rt.objective ?
                this.getObjective(rt.objective.id) :
                null
        };
        if ("sortOrder" in rt) {
            result.sortOrder = rt.sortOrder;
        }
        return result;
    }
    /**
     * @private
     */
    static _getIdOfObjective(any) {
        if (any instanceof Objective || any instanceof Minecraft.ScoreboardObjective) {
            return any.id;
        }
        else if (any && typeof any === "string") {
            return any;
        }
        else {
            throw new TypeError("unknown objective");
        }
    }
    /**
     * 设置显示位上显示的记分项，并允许额外的设置。
     * @param {DisplaySlot} slot - 显示位。
     * @param {DisplayOptionDefines} settings - 显示位的设置。
     * @returns {Objective} 显示位先前显示的记分项的对象，若先前未显示任何记分项，返回 `undefined` 。
     */
    static setDisplayAtSlot(slot, settings) {
        let objective = this.getObjective(SimpleScoreboard._getIdOfObjective(settings?.objective));
        if (objective == null) {
            throw new Error("Unknown objective in settings");
        }
        let settingArg;
        try { //兼容旧版
            if ("sortOrder" in settings) {
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(objective.vanillaObjective, settings.sortOrder);
            }
            else {
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(objective.vanillaObjective);
            }
        }
        catch { //新版本修改为接口
            settingArg = {
                objective: objective.vanillaObjective
            };
            if ("sortOrder" in settings) {
                settingArg.sortOrder = settings.sortOrder;
            }
        }
        let lastDisplayingObjective = VanillaScoreboard.setObjectiveAtDisplaySlot(slot, settingArg);
        if (lastDisplayingObjective == undefined)
            return undefined;
        return this.getObjective(lastDisplayingObjective.id);
    }
    /**
     * 清空显示位上正显示的记分项。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {Objective} 显示位先前显示的记分项，若无，返回 `null` 。
     */
    static clearDisplaySlot(slot) {
        let rt = VanillaScoreboard.clearObjectiveAtDisplaySlot(slot);
        if (rt?.id !== undefined) {
            return this.getObjective(rt.id);
        }
        else {
            return null;
        }
    }
    /**
     * 返回记分板上记录的所有分数持有者。
     * @returns {Entry}
     */
    static getEntries() {
        return Array.from(VanillaScoreboard.getParticipants())
            .map(scbid => Entry.getEntry({ scbid, type: scbid.type }));
    }
    /**
     * 移除记分板的所有记分项。
     */
    static removeAllObjectives() {
        Array.from(VanillaScoreboard.getObjectives())
            .forEach(obj => {
            this.removeObjective(obj);
        });
    }
    /**
     * 以异步方式重置分数持有者的分数。
     * @param {(entry:Entry) => boolean} [filter] - 可选的过滤器函数，
     * 将所有分数持有者的 `Entry` 对象依次传入，若得到 `true` ，则重置
     * 此分数持有者的分数，否则将不会重置。
     * @returns {Promise<number>} 重置了多少分数持有者的分数。
     */
    static async postResetAllScores(filter = null) {
        if (arguments.length === 0) {
            let rt = await Command.add(Command.PRIORITY_HIGHEST, "scoreboard players reset *");
            if (rt.statusCode !== StatusCode.success) {
                throw new Error(rt.statusMessage);
            }
            else {
                return rt.successCount;
            }
        }
        let resolve;
        let promise = new Promise((re) => {
            resolve = re;
        });
        let entries = this.getEntries();
        let successCount = 0;
        let doneCount = 0;
        let successCountAdder = () => {
            successCount++;
        };
        let resolveIfDone = () => {
            if (++doneCount === entries.length) {
                resolve(successCount);
            }
        };
        entries.filter(filter).forEach((id) => {
            this.postResetScore(id)
                .then(successCountAdder)
                .finally(resolveIfDone);
        });
        return promise;
    }
    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static async postResetScore(entry) {
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY) {
            let ent = entry.getEntity();
            if (ent == null) {
                throw new Error("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, "scoreboard", "players", "reset", "@s");
            if (rt.statusCode != StatusCode.success) {
                throw new Error("Could not set score, maybe entity or player disappeared?");
            }
        }
        else if ([...VanillaWorld.getPlayers({ name: entry.displayName })].length === 0) {
            let rt = await Command.add(Command.PRIORITY_HIGHEST, Command.getCommandMoreStrict("scoreboard", "players", "reset", entry.displayName));
            if (rt.statusCode !== StatusCode.success) {
                throw new Error(rt.statusMessage);
            }
        }
        else {
            throw new NameConflictError(entry.displayName);
        }
    }
}
/* Objective.js */
/**
 * 检查传入的参数是否为整数数字，并且在 [-2^31, 2^31-1] 的区间。
 * @param {...number} scores 要检查的变量。
 * @throws {ScoreRangeError} 若参数不符合条件。
 */
function checkScoreIsInRange(...scores) {
    for (let s of scores) {
        if (Number.isInteger(s) === false
            || s > 2147483647
            || s < -2147483648) {
            throw new ScoreRangeError();
        }
    }
}
/**
 * 记分项记录了参与者以及他们的分数。
 */
class Objective {
    #scoreboard;
    #objectiveOptions;
    #id;
    #criteria;
    #displayName;
    #unregistered = false;
    #vanillaObjective;
    get scoreboard() {
        return this.#scoreboard;
    }
    /**
     * 记分项的标识符。
     * @returns {string}
     */
    get id() {
        return this.#id;
    }
    /**
     * 记分项的准则，应该为 `"dummy"`。
     * @returns {"dummy"}
     */
    get criteria() {
        return this.#criteria;
    }
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     */
    get displayName() {
        return this.#displayName;
    }
    /**
     * 此记分项对象是否只允许使用 `getScore()`
     * （此功能未实现）。
     * @returns {boolean} 表示是否此记分项对象只允许使用 `getScore()`。
     */
    isReadOnly() {
        this.checkUnregistered();
        return !!this.#objectiveOptions?.readonly;
    }
    /**
     * 检测此对象对应的记分项是否已经被移除。
     * @returns {boolean} 检测结果。若已被移除，返回 `true`，否则返回 `false`。
     */
    isUnregistered() {
        if (!this.#unregistered) {
            let currentVanillaObjective = VanillaScoreboard.getObjective(this.#id);
            if (currentVanillaObjective === undefined
                || currentVanillaObjective === null
                || (currentVanillaObjective !== this.#vanillaObjective
                    && currentVanillaObjective !== this.#vanillaObjective?.vanillaObjective)) {
                this.#unregistered = true;
            }
        }
        return this.#unregistered;
    }
    /**
     * 检查此对象对应的记分项是否被移除。
     * @throws {ObjectiveUnregisteredError} 当此对象对应的记分项被移除时。
     */
    checkUnregistered() {
        if (this.isUnregistered())
            throw new ObjectiveUnregisteredError(this.#id);
    }
    /**
     * 原始记分项对象。
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象。
     */
    get vanillaObjective() {
        return this.#vanillaObjective;
    }
    /**
     * 将此对象对应的记分项从记分板上移除。
     */
    unregister() {
        this.checkUnregistered();
        VanillaScoreboard.removeObjective(this.#id);
    }
    /**
     * @hideconstructor
     */
    constructor(...args) {
        if (args.length === 1) {
            let { scoreboard, vanillaObjective, name, displayName, criteria, objectiveOptions } = args[0];
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        }
        else {
            let [scoreboard, name, criteria, displayName, vanillaObjective, objectiveOptions] = args;
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        }
    }
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    postAddScore(entry, score) {
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("add", entry, score)
            .then(() => { });
    }
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     *
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    postRandomScore(entry, min = -2147483648, max = 2147483647, useBuiltIn = true) {
        checkScoreIsInRange(min, max);
        if (useBuiltIn) {
            let vals = max - min;
            let randomScore = vals * Math.random();
            let result = Math.round(randomScore + min);
            return this.postSetScore(entry, result);
        }
        else {
            if (min > max) {
                throw new Error("min > max");
            }
            return this.#postPlayersCommand("random", entry, min, max)
                .then(() => { });
        }
    }
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    async postRemoveScore(entry, score) {
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("remove", entry, score)
            .then(() => { });
    }
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScore(entry) {
        return this.#postPlayersCommand("reset", entry)
            .then(() => { });
    }
    /**
     * 重置所有在此记分项上的分数持有者的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScores() {
        this.checkUnregistered();
        return Command.add(Command.PRIORITY_HIGHEST, Command.getCommandMoreStrict("scoreboard", "players", "reset", "*", this.#id))
            .then(rt => {
            if (rt.statusCode !== StatusCode.success) {
                throw new Error(rt.statusMessage);
            }
        });
    }
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @returns {Promise<number>} 由 `score` 指定的新分数。
     * 完成操作后，将会敲定并返回 `score`。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    postSetScore(entry, score) {
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("set", entry, score)
            .then(() => score);
    }
    /**
     * 异步获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {Promise<number>} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    postGetScore(entry) {
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        return this.#postGetScore(entry);
    }
    async #postGetScore(entry) {
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        }
        catch {
            this.checkUnregistered();
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            }
            catch {
                return undefined;
            }
        }
    }
    /**
     * 为分数持有者在记分项上执行特定的操作。
     * @param {string} option - 操作类型。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {...any} args - 操作所需要的参数。
     * @returns {Promise<true>} 操作成功。
     * @throws {InternalError} 未知的命令错误。
     * @throws {NameConflictError} 若尝试为虚拟玩家设置分数，且世界中有相同名字的玩家时。
     */
    #postPlayersCommand(option, entry, ...args) {
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY) {
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, "@s", this.#id);
            let ent = entry.getEntity();
            if (ent === undefined) {
                throw new InternalError("Could not find the entity");
            }
            return Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, cmd, ...args)
                .then((rt) => {
                if (rt.statusCode === StatusCode.success) {
                    return true;
                }
                this.checkUnregistered();
                //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                throw new InternalError(`Could not ${option} score, `
                    + "maybe entity or player disappeared?"
                    + "\n  cause by: "
                    + rt.statusMessage);
            });
        }
        else if ([...VanillaWorld.getPlayers({ name: entry.displayName })].length === 0) {
            let cmd = Command.getCommandMoreStrict("scoreboard", "players", option, entry.displayName, this.#id);
            return Command.addParams(Command.PRIORITY_HIGHEST, cmd, ...args)
                .then((rt) => {
                if (rt.statusCode === StatusCode.success) {
                    return true;
                }
                this.checkUnregistered();
                //我觉得这里应该不会被执行到了，如果被执行到，请告诉我
                throw new InternalError(`Could not ${option} score, `
                    + "maybe entity or player disappeared?"
                    + "\n  cause by: "
                    + rt.statusMessage);
            });
        }
        else {
            throw new NameConflictError(entry.displayName);
        }
    }
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {number} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    getScore(entry) {
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        }
        catch {
            this.checkUnregistered();
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            }
            catch {
                return undefined;
            }
        }
    }
    /**
     * 获取在此记分项上拥有分数记录的分数持有者。
     * @returns {Entry[]} 一个包含了在记分项上的分数持有者的数组。
     */
    getEntries() {
        this.checkUnregistered();
        return Array.from(this.vanillaObjective.getParticipants())
            .map((scbid) => Entry.getEntry({ scbid, type: scbid.type }));
    }
    /**
     * 遍历在此记分项上拥有分数记录的所有分数持有者，为其创建一个
     * `ScoreInfo` 对象，表示了这些分数持有者在此记分项上的分数。
     * @returns {ScoreInfo[]} 一个数组，包含了所有在此记分项上拥有分数记录的分数持有者的 `ScoreInfo` 对象。
     */
    getScoreInfos() {
        this.checkUnregistered();
        return Array.from(this.getEntries())
            .map((_) => {
            return this.getScoreInfo(_);
        });
    }
    /**
     * 获取一个 `ScoreInfo` 对象，表示了分数持有者以及他在此记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     * @throws {ObjectiveUnregisteredError} 当此对象对应的记分项被移除时。
     */
    getScoreInfo(entry, autoInit = false) {
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        let scoreInfo = new ScoreInfo(this, entry);
        if (autoInit == true && scoreInfo.score == null)
            scoreInfo.score = 0;
        return scoreInfo;
    }
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    setScore(entry, score) {
        return this.postSetScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上减少分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    removeScore(entry, score) {
        return this.postRemoveScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     *
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    randomScore(entry, min = -2147483647, max = 2147483647, useBuiltIn = false) {
        return this.postRandomScore.apply(this, arguments);
    }
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    resetScore(entry) {
        return this.postResetScore.apply(this, arguments);
    }
    /**
     * 为分数持有者在记分项上增加分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    addScore(entry, score) {
        return this.postAddScore.apply(this, arguments);
    }
}
/**
 * 一个对象，包含了分数持有者，以及其在某一记分项上的分数。
 * @deprecated 无法保证某些属性可以正常工作。
 */
class ScoreInfo {
    #entry;
    #objective;
    /**
     * @param {Objective} obj
     * @param {Entry} entry
     */
    constructor(obj, entry) {
        if (!(obj instanceof Objective))
            throw new TypeError("Not an Objective type");
        if (!(entry instanceof Entry))
            throw new TypeError("Not an Entry type");
        this.#objective = obj;
        this.#entry = entry;
    }
    /**
     * @param {number} score
     */
    set score(score) {
        this.#objective.setScore(this.#entry, score);
    }
    /**
     * @type {number}
     * 分数持有者在记分项上的分数
     */
    get score() {
        return this.#objective.getScore(this.#entry);
    }
    /**
     * 重置此对象对应的分数持有者在对应的记分项上的分数。
     */
    reset() {
        return this.#objective.resetScore(this.#entry);
    }
    getEntry() {
        return this.#entry;
    }
    getObjective() {
        return this.#objective;
    }
    toString() {
        return `ScoreInfo { Score: ${this.score}, Entry: ${this.getEntry().id} }`;
    }
}
/* export */
export { SimpleScoreboard as Scoreboard, Objective, Entry, };
export { ObjectiveUnregisteredError, NameConflictError, UnknownEntryError, ScoreRangeError, };
export { DisplaySlot, ObjectiveSortOrder, EntryType, };
export default SimpleScoreboard;
