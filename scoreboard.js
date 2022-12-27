import * as Minecraft from "@minecraft/server";

/*
    "authors": [
      "Silvigarabis"
    ],
    "license": "MIT LICENSE",
    "url": "https://github.com/Silvigarabis/yoni-mcscripts-lib"

测试版本：1.19.50
    理论上1.19.30也能用，不过我没试
    
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
 
const VanillaWorld = Minecraft.world;
const VanillaEvents = VanillaWorld.events;
const VanillaScoreboard = VanillaWorld.scoreboard;
const MinecraftSystem = Minecraft.system;

/**
 * @param {(...args) => void} callback 
 * @param {...any} args
 */
const runTask = (callback, ...args) => {
    if (MinecraftSystem.run){
        MinecraftSystem.run(callback, ...args);
    } else {
        const runTask = ()=>{
            VanillaEvents.tick.unsubscribe(runTask);
            callback(...args);
        };
        VanillaEvents.tick.subscribe(runTask);
    }
}

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

let log = (...msg)=>{
    console.error(...msg);
};
/**
 * generates a command by a set of params, and try to make sure that every arg is standalone
 * @param {string} cmd 
 * @param  {string[]|...string} args 
 * @returns {string} command
 */
function getCommand(cmd, ...args){
    if (args?.length === 1 && Array.isArray(args[0])){
        args = args[0];
    }
    if (args.length !== 0){
        //遍历每个参数，对满足某一条件的参数进行处理
        args.forEach((arg) => {
            let shouldQuote = false; //标记是否应当在两侧添加引号
            arg = String(arg);
            if (arg.trim().length === 0){ //空参数
                shouldQuote = true;
            }/* else if (getCommand.startsWithNumberRegex.test(arg)){ //以数字开头的参数
                shouldQuote = true;
            }*/ else if (getCommand.spaceCharRegex.test(arg)){ //含有空格，需要引号括起
                shouldQuote = true;
            }
            if (getCommand.specificCharRegex.test(arg)){ //将特殊符号转义
                arg = arg.replaceAll(getCommand.specificCharGlobalRegex, "\\$1");
            }
            if (shouldQuote){ //如果需要引号，则添加引号
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
/** @returns {number} */
function countNextQueues(){
    return commandQueues[4].length
    + commandQueues[3].length
    + commandQueues[2].length
    + commandQueues[1].length
    + commandQueues[0].length;
}
/** @returns {CommandQueue} */
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
/** remove next queue */
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

/** @type {CommandQueue} */
let lastFailedCommand = null;

function executeCommandQueues(){
    runTask(executeCommandQueues);
    let executeQueueCount = 0;
    while (hasNextQueue()){
        //从队列plus中取得一个排队中的命令
        let commandQueue = fetchNextQueue();
        //然后将命令送入minecraft 的命令队列
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
    async resolveResult(commandPromise){
        
        //然后是获取命令结果(但是现在已经没有结果了)
        //所以只好生成一个
        let commandResult = { statusCode: StatusCode.success };
        let rt = null;
        try {
            rt = await commandPromise;
        } catch (commmandExecuteErrorMessage){
            commandResult.statusCode = StatusCode.error;
            commandResult.statusMessage = String(commmandExecuteErrorMessage);
        }
        try {
            if (rt != null){
                for (let key in rt){
                    if (key in commandResult){
                        continue;
                    }
                    commandResult[key] = rt[key];
                }
            }
        } catch(e){ //在commandResult出现问题的时候大概会触发这段代码
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
    static countQueues(){
        return countNextQueues();
    }
    
    /**
     * execute a command
     * @param {string} command
     */
    static fetch(command){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, command);
    }
    /**
     * execute a command with params
     * @param {...string} params - Command params
     * @returns {Promise<CommandResult>}
     */
    static fetchParams(...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, overworld, getCommand(...params));
    }
    /**
     * execute a command with params by specific sender
     * @param {CommandSender} sender - Command's sender
     * @param {...string} params - command params
     * @returns {Promise<CommandResult>}
     */
    static fetchExecuteParams(sender, ...params){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, getCommand(...params));
    }
    /**
     * execute a command by specific sender
     * @param {CommandSender} sender - Command's sender
     * @returns {Promise<CommandResult>}
     */
    static fetchExecute(sender, command){
        return Command.addExecute(Command.PRIORITY_NORMAL, sender, command);
    }
    
    /**
     * add a command to specific priority to execute
     * @param {CommandPriority} priority 
     * @param {string} command 
     * @returns {Promise<CommandResult>}
     */
    static add(priority, command){
        return Command.addExecute(priority, overworld, command);
    }
    /**
     * add a command with params to specific priority to execute
     * @param {CommandPriority} priority 
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addParams(priority, ...params){
        return Command.addExecute(priority, overworld, getCommand(...params));
    }
    /**
     * add a command with params to specific priority to execute by sender
     * @param {CommandPriority} priority 
     * @param {CommandSender} sender
     * @param {...string} params
     * @returns {Promise<CommandResult>}
     */
    static addExecuteParams(priority, sender, ...params){
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
    
    /**
     * get command by params
     * @param {string} command 
     * @param  {...string} args - command params
     * @returns {string} command
     */
    static getCommand(command, ...args){
        return getCommand(command, ...args);
    }
    /**
     * execute a set of commands by sender
     * @param {CommandSender} sender 
     * @param {string[]} commands - command
     * @returns {Promise<CommandResult[]>}
     */
    static async postExecute(sender, commands){
        commands = Array.from(commands);
        let promises = commands.map((cmd)=>Command.fetchExecute(sender, cmd));
        let results = [];
        for (let pro of promises){
            results.push(await pro);
        }
        return Promise.all(results);
    }
    
    static run(command){
        if (overworld.runCommand){
            try {
                return Object.assign({}, overworld.runCommand(command));
            } catch (e){
                return JSON.parse(e);
            }
        }
        throw new Error("current version doesn't support 'Command.run' method, try 'Command.fetch' instead");
    }
    static execute(sender, command){
        if (sender.runCommand){
            try {
                return Object.assign({}, sender.runCommand(command));
            } catch (e){
                return JSON.parse(e);
            }
        }
        throw new Error("current version doesn't support 'Command.execute' method, try 'Command.fetchExecute' instead");
    }
}

runTask(executeCommandQueues);

let idRecords = new Map();
let nameRecords = new Map();
let entityRecords = new WeakMap();
let scbidRecords = new WeakMap();

/** @enum {Minecraft.ScoreboardIdentityType} */
const EntryType = {
    PLAYER: Minecraft.ScoreboardIdentityType.player,
    ENTITY: Minecraft.ScoreboardIdentityType.entity,
    FAKE_PLAYER: Minecraft.ScoreboardIdentityType.fakePlayer
    
}

/**
 * @interface
 * @typedef {Object} EntryOption
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
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} any
     * @returns {Entry}
     */
    static guessEntry(any){
        if (any instanceof Minecraft.ScoreboardIdentity)
            return this.getEntry({scbid: any});
        if (any instanceof YoniEntity || any instanceof Minecraft.Entity || any instanceof Minecraft.Player)
            return this.getEntry({entity: any});
        if (typeof any === "string")
            return this.getEntry({name: any, type: EntryType.FAKE_PLAYER});
        if (!isNaN(Number(any)))
            return this.getEntry({id: any});
        throw new Error("Sorry, couldn't guess the entry");
    }
    
    /**
     * 
     * @param {EntryOption} option 
     * @returns {Entry}
     */
    static getEntry(option){
        
        let { entity, id, name, scbid, type } = option;
        entity = (entity instanceof YoniEntity) ? entity.vanillaEntity : entity;
        let entry;
        
        if (type === EntryType.FAKE_PLAYER && scbid !== undefined)
            name = scbid.displayName;
            
        //优先级: entity, scbid, id, name
        if (entityRecords.has(entity))
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
            
        if (entry.getVanillaEntity() != null)
            entityRecords.set(entry.getVanillaEntity(), entry);
        if (entry.id !== undefined)
            idRecords.set(entry.id, entry);
        if (entry.vanillaScbid !== undefined)
            scbidRecords.set(entry.vanillaScbid, entry);
        if (type === EntryType.FAKE_PLAYER && entry.displayName !== undefined)
            nameRecords.set(entry.displayName, entry);
        
        return entry;
    }
    
    #type;
    #id;
    #name;
    #vanillaScbid;
    #entity;
    
    /**
     * Type of the scoreboard identity.
     * @returns {EntryType}
     */
    get type(){
        return this.#type;
    }
    
    /**
     * Identifier of the scoreboard identity.
     * @returns {number}
     */
    get id(){
        if (this.vanillaScbid?.id !== this.#id)
            this.#id = this.vanillaScbid?.id;
        return this.#id;
    }
    
    /**
     * Returns the player-visible name of this identity.
     * @returns {string}
     */
    get displayName(){
        if (this.vanillaScbid !== undefined && this.#vanillaScbid.displayName !== undefined)
            return this.vanillaScbid.displayName;
        if (this.#type == EntryType.PLAYER)
            return this.#entity.name;
        if (this.#type  == EntryType.ENTITY)
            return this.id;
        if (this.#type === EntryType.FAKE_PLAYER)
            return this.#name;
        
    }
    
    /**
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid(){
        if ((this.#type === EntryType.PLAYER || this.#type === EntryType.ENTITY)
        && this.#entity.scoreboard !== this.#vanillaScbid)
            this.#vanillaScbid = this.#entity.scoreboard;
        if (this.#vanillaScbid !== undefined && scbidRecords.get(this.#vanillaScbid) !== this)
            scbidRecords.set(this.#vanillaScbid, this);
        return this.#vanillaScbid;
    }
    
    /**
     * If the scoreboard identity is an entity or player, returns 
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity}
     */
    getEntity(){
        if (this.#type === EntryType.FAKE_PLAYER)
            this.#entity = null;
        return this.#entity;
    }
    
    getVanillaEntity(){
        if (this.#type === EntryType.FAKE_PLAYER)
            this.#entity = null;
        return this.#entity;
    }
    
    /** @returns {Entry} Returns self, after update the vanillaScbid record */
    update(){
        if (this.#type === EntryType.FAKE_PLAYER){
            this.#vanillaScbid = undefined;
            for (let s of VanillaScoreboard.getParticipants()){
                if (s.displayName === this.#name && s.type === this.#type){
                    this.#vanillaScbid = s;
                    break;
                }
            }
        } else {
            //使用getter重新初始化变量
            let i = this.vanillaScbid;
        }
        return this;
    }
    
    /**
     * @hideconstructor
     */
    constructor(option){
        let { entity, id, name, scbid, type } = option;
        
        //处理时使用原版实体对象
        entity = (entity instanceof YoniEntity) ? entity.vanillaEntity : entity;
        
        if (entity !== undefined){
            if (entity instanceof Minecraft.Player)
                type = EntryType.PLAYER;
            else if (entity instanceof Minecraft.Entity)
                type = EntryType.ENTITY;
            else throw new TypeError("Unknown entity type");
            scbid = entity.scoreboard;
            id = scbid?.id;
        } else {
            let condF = null;
            if (type === EntryType.FAKE_PLAYER && name !== "" && name !== scbid?.displayName){
                condF = (_)=>{
                    return _.displayName === name && type === _.type;
                };
            } else if (id !== undefined && scbid === undefined){
                condF = (_)=>{
                    return _.id === id;
                };
            }
            
            if (condF !== null){
                scbid = undefined;
                for (let s of VanillaScoreboard.getParticipants()){
                    if (condF(s)){
                        scbid = s;
                        break;
                    }
                }
            }
            if (scbid !== undefined){
                type = scbid.type;
                name = scbid.displayName;
                id = scbid.id;
                entity = scbid.getEntity();
            } else if (id !== undefined){
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

class ScoreRangeError extends Error {
    name = "ScoreRangeError";
    message = "Score must be an integer and can only range -2147483648 to 2147483647";
}

class ObjectiveUnregisteredError extends Error {
    name = "ObjectiveUnregisteredError";
    constructor(name){
        super(`Objective ${name} has been unregistered.`);
    }
}

class NameConflictError extends Error {
    name = "NameConflictError";
    constructor(name){
        super(`Could not set score because there are name conflict! More than one ${name}`);
    }
}

/**
 * @readonly
 * @enum
 * enum of alive display slot
 */
const DisplaySlotType = {
    /** @type {DisplaySlot} */
    list: "list",
    /** @type {DisplaySlot} */
    sidebar: "sidebar",
    /** @type {DisplaySlot} */
    belowname: "belowname"
}

const ObjectiveSortOrder = {
    /** @type {SortOrder} */
    "ascending": "ascending",
    /** @type {SortOrder} */
    "descending": "descending"
}

/**
 * @interface
 * 与显示位置有关的类型
 * @typedef {Object} DisplayOptions
 * @property {SortOrder} [sortOrder] - 如果可能，在此位置上排序使用的方式
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 此位置上显示的记分项
 */

/**
 * Contains objectives and participants for the scoreboard.
 */
class SimpleScoreboard {
    /**
     * @type {Map<string, Objective>}
     */
    static #objectives = new Map();
    
    /**
     * Adds a new objective to the scoreboard.
     * @param {string} name - name of new objective
     * @param {string} criteria - criteria of new objective, current only accept "dummy"
     * @param {string} displayName - displayName of new
     * objective, default is equals to name
     * @returns {Objective} new objective
     * @throws This function can throw errors.
     */
    static addObjective(name, criteria="dummy", displayName=name){
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        if (this.getObjective(name) !== null)
            throw new Error("Objective "+name+" existed!");
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
     * @remarks Removes an objective from the scoreboard.
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - objectiveId or Objective
     * @throws Throws when cannot determine the objective
     */
    static removeObjective(nameOrObjective){
        let objectiveId;
        if (nameOrObjective instanceof Objective || nameOrObjective instanceof Minecraft.ScoreboardObjective){
            objectiveId = nameOrObjective.id;
        } else {
            objectiveId = nameOrObjective;
        }
        if (objectiveId && typeof objectiveId === "string"){
            try { VanillaScoreboard.removeObjective(objectiveId); } catch {}
        } else {
            throw new Error("unknown error while removing objective");
        }
        if (this.#objectives.has(objectiveId)){
            this.#objectives.delete(objectiveId);
        }
    }
    
    /**
     * Returns a specific objective (by id).
     * @param {string} name - objectiveId
     * @param {boolean} autoCreateDummy - if true, it will try to create a dummy objective when objective didn't exist
     * @returns {?Objective} return Objective if existed, else return null
     */
    static getObjective(name, autoCreateDummy=false){
        let result = null;
        let objective = this.#objectives.get(name);
        let vanillaObjective = (()=>{
            let rt = VanillaScoreboard.getObjective(name);
            if (rt == null && autoCreateDummy){
                rt = VanillaScoreboard.addObjective(name, name);
            }
            return rt;
        })();
        if (objective === undefined || objective.isUnregistered()){
            if (vanillaObjective != null){
                result = new Objective(this, name, "dummy", vanillaObjective.displayName, vanillaObjective);
                this.#objectives.set(name, result);
            }
        } else {
            result = objective;
        }
        return result;
    }
    
    /** 
     * @remarks
     * Returns all defined objectives.
     * @returns {Objective[]} an array contains all defined objectives.
     */
    static getObjectives(){
        return Array.from(VanillaScoreboard.getObjectives())
            .map(obj=>this.getObjective(obj.id));
    }
    
    /**
     * Returns an objective that occupies the specified display
     * slot.
     * @param {DisplaySlot} slot
     * @returns {DisplayOptions}
     * @throws This function can throw errors.
     */
    static getDisplayAtSlot(slot){
        let rt = VanillaScoreboard.getObjectiveAtDisplaySlot(slot);
        let result = {
            objective: rt.objective ?
                this.getObjective(rt.objective.id) :
                null
        };
        if ("sortOrder" in rt){
            result.sortOrder = rt.sortOrder;
        }
        return result;
    }
    
    static #getIdOfObjective(any){
         if (any instanceof Objective || any instanceof Minecraft.ScoreboardObjective){
             return any.id
         } else if (any && typeof any === "string"){
             return any;
         } else {
             throw new TypeError();
         }
    }
    /**
     * @remarks
     * 在指定位置上显示记分项
     * @param {DisplaySlot} slot - 位置的id
     * @param {DisplayOptions} settings - 对于显示方式的设置
     * @returns {Objective} 指定显示位置的记分项对应的对象
     */
    static setDisplayAtSlot(slot, settings){
        let obj = this.getObjective(this.#getIdOfObjective(settings.objective));
        let settingArg;
        try {
            if ("sortOrder" in settings){
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    obj.vanillaObjective,
                    settings.sortOrder
                );
            } else {
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    obj.vanillaObjective
                );
            }
        } catch {
            settingArg = {
                objective: obj.vanillaObjective
            };
            if ("sortOrder" in settings){
                settingArg.sortOrder = settings.sortOrder
            }
        }
        VanillaScoreboard.setObjectiveAtDisplaySlot(
            slot,
            settingArg
        );
        return obj;
    }
    
    /**
     * @remarks
     * Clears the objective that occupies a display slot.
     * @param {DisplaySlot} slot - 位置的id
     * @returns {?Objective}
     * @throws TypeError when slot not a DisplaySlot.
     */
    static clearDisplaySlot(slot){
        let rt = VanillaScoreboard.clearObjectiveAtDisplaySlot(slot);
        if (rt?.id !== undefined){
            return this.getObjective(rt.id);
        } else {
            return null;
        }
    }
    
    /**
     * @remarks
     * Returns all defined scoreboard identities.
     * @returns {Entry[]}
     */
    static getEntries(){
        return Array.from(VanillaScoreboard.getParticipants())
            .map((scbid) => Entry.getEntry({
                scbid,
                type: scbid.type
            }));
    }
    
    /**
     * remove all objectives from scoreboard
     */
    static removeAllObjectives(){
        Array.from(VanillaScoreboard.getObjectives())
            .forEach(obj=>{
                this.removeObjective(obj);
            });
    }
    
    /**
     * reset scores of all participants (in asynchronously)
     * @param {(entry:Entry) => boolean} filter - particular 
     * filter function, the function will be call for each 
     * participants, if return true, then reset the scores of 
     * participants
     * @return {Promise<number>} success count
     */
    static async postResetAllScore(filter=null){
        if (filter === null){
            let rt = await Command.fetch("scoreboard players reset *");
            if (rt.statusCode){
                throw new Error(rt.statusMessage);
            } else {
                return;
            }
        }
        let resolve;
        let promise = new Promise((re)=>{
            resolve = re;
        });
        let entries = this.getEntries();
        let successCount = 0;
        let doneCount = 0;
        let successCountAdder = ()=>{
            successCount++;
        };
        let resolveIfDone = ()=>{
            if (++doneCount === entries.length){
                resolve(successCount);
            }
        };
        entries.filter(filter).forEach((id)=>{
            this.postResetScore(id)
                .then(successCountAdder)
                .finally(resolveIfDone);
        });
        return promise;
    }
    
    /**
     * 重置记分板上指定项目的所有分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry 
     */
    static async postResetScore(entry){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let ent = entry.getEntity();
            if (ent == null){
                throw new InternalError("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, "scoreboard", "players", "reset", "@s");
            if (rt.statusCode != StatusCode.success){
                throw new InternalError("Could not set score, maybe entity or player disappeared?");
            }
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "scoreboard", "players", "reset", entry.displayName);
            if (rt.statusCode !== StatusCode.success){
                throw new InternalError(rt.statusMessage);
            }
        } else {
            throw new NameConflictError(entry.displayName);
        }
    }
}

//保证兼容所用
class YoniEntity {}

/**
 * check whether numbers is in range from -2^31 to 2^31-1
 * @param  {...number} scores 
 * @throws Throws when one of number not in range
 */
function checkScoreIsInRange(...scores){
    for (let s of scores){
        if (Number.isInteger(s) === false
        || s > 2147483647
        || s < -2147483648){
            throw new ScoreRangeError();
        }
    }
}

/**
 * 包含记分板的目标（记分项）和参与者（记分对象）。
 */
class Objective {
    #scoreboard;
    #objectiveOptions;
    #id;
    #criteria;
    #displayName;
    #unregistered = false;
    #vanillaObjective;
    
    /**
     * 返回指向同一记分项的对象，但是不会检查原版记分项是否存在。在项目数较多时，使用此类记分项对象可以提高性能
     * @returns {Objective} 指向同一记分项的对象，但是不会检查原版记分项是否存在
     */ 
    withoutExistenceCheck(){
        let nObj = new Objective(this);
        nObj.checkUnregistered = function(){};
    }
    
    get scoreboard(){
        return this.#scoreboard;
    }

    /**
     * 记分项的标识符。
     * @returns {string}
     * @throws This property can throw when used.
     */
    get id(){
        return this.#id;
    }
    
    /**
     * 记分项的准则
     * @throws This property can throw when used.
     */
    get criteria(){
        return this.#criteria;
    }
    
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     * @throws This property can throw when used.
     */
    get displayName(){
        return this.#displayName;
    }
    
    /** 
     * 此记分项对象是否只允许使用getScore()
     * （此功能未实现）
     * @returns {boolean} 表示是否此记分项对象只允许使用getScore()
     */
    isReadOnly(){
        this.checkUnregistered();
        return !!this.#objectiveOptions?.readonly;
    }
    
    /**
     * 检测此对象对应的记分项是否已经被移除
     * @returns {boolean} 此对象对应的记分项是否已经被移除。
     */
    isUnregistered(){
        if (!this.#unregistered){
            let currentVanillaObjective = VanillaScoreboard.getObjective(this.#id);
            if (currentVanillaObjective === undefined
            || currentVanillaObjective === null
            || (
                currentVanillaObjective !== this.#vanillaObjective
                && currentVanillaObjective !== this.#vanillaObjective?.vanillaObjective
            )){
                this.#unregistered = true;
            }
        }
        return this.#unregistered;
    }

    /**
     * 检查此对象对应的记分项是否被移除
     * @throws 当此对象对应的记分项被移除时抛出错误
     */
    checkUnregistered(){
        if (this.isUnregistered())
            throw new ObjectiveUnregisteredError(this.#id);
    }
    
    /**
     * 原始记分项对象
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象
     */
    get vanillaObjective(){
        return this.#vanillaObjective;
    }
    
    /**
     * 将此对象对应的记分项从记分板上移除
     * @throws This function can throw error when objective has been unregistered.
     */
    unregister(){
        this.checkUnregistered();
        
        VanillaScoreboard.removeObjective(this.#id);
    }
    
    constructor(...args){
        
        if (args.length === 1){
            let { scoreboard, vanillaObjective, name, displayName, criteria, objectiveOptions } = args[0];
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        } else {
            let [ scoreboard, name, criteria, displayName, vanillaObjective, objectiveOptions ] = args;
            this.#vanillaObjective = vanillaObjective;
            this.#scoreboard = scoreboard;
            this.#id = name;
            this.#criteria = criteria;
            this.#displayName = displayName;
            this.#objectiveOptions = objectiveOptions;
        }
    }
    
    /**
     * 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    postAddScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("add", entry, score)
            .then(bool => {
                if (bool)
                    return this.getScore(entry);
                else
                    throw new InternalError("Could not add score, maybe entity or player disappeared?");
            });
    }
    
    /**
     * 为记分板项目在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} min=-2147483647 - 随机分数的最小值
     * @param {number} max=2147483647 - 随机分数的最大值
     * @param {boolean} useBuiltIn=false - 是否在js代码层面进行随机。
     * 由于实现原理以及Minecraft自身的特性，一次随机只能有2^64-1种可能，
     * 如果将最小值设置为-2147483648，并将最大值设置为2147483647，
     * 随机的结果一定会是 -2147483648。
     * 如果想要避免这种情况，请将此项设置为true。
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async postRandomScore(entry, min=-2147483648, max=2147483647, useBuiltIn=false){
        checkScoreIsInRange(min, max);
        if (useBuiltIn) {
            let vals = max - min + 1;
            let randomScore = vals * Math.random();
            let result = Math.round(randomScore + min);
            return this.postSetScore(entry, result);
        } else {
            return this.#postPlayersCommand("random", entry, min, max)
                .then(bool => {
                    if (bool)
                        return this.getScore(entry);
                    else
                        throw new InternalError("Could not random score, maybe entity or player disappeared?");
                });
        }
    }
    
    /**
     * 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    async postRemoveScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("remove", entry, score)
            .then(bool => {
                if (bool)
                    return this.getScore(entry);
                else
                    throw new InternalError("Could not remove score, maybe entity or player disappeared?");
            });
    }
    
    /**
     * 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     */
    async postResetScore(entry){
        if (true !== await this.#postPlayersCommand("reset", entry)){
            throw new InternalError("Could not reset score, maybe entity or player disappeared?");
        }
    }
    
    /**
     * 重置所有在记分项上的记分板项目的分数
     */
    async postResetScores(){
        let rt = await Command.addParams(Command.PRIORITY_HIGHEST, "scoreboard", "players", "reset", "*", this.#id);
        if (rt.statusCode !== StatusCode.success){
            throw new Error(rt.statusMessage);
        }
    }
    
    /**
     * 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     */
    postSetScore(entry, score){
        checkScoreIsInRange(score);
        return this.#postPlayersCommand("set", entry, score)
            .then(bool => {
                if (bool)
                    return score;
                else
                    throw new InternalError("Could not set score, maybe entity or player disappeared?");
            });
    }
    
    /**
     * 异步获取记分板项目在记分项上的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @returns {Promise<number>} 记分板项目的分数
     * @throws This function can throw errors.
     */
    postGetScore(entry){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        return this.#postGetScore(entry);
    }
    async #postGetScore(entry){
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        } catch {
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            } catch { return undefined; }
        }
    }
    
    /**
     * 为记分板项目在记分项上执行特定的操作
     * @param {string} option - 操作的名称
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {...any} args - 操作所需要的参数
     * @returns {Promise<boolean>} 操作是否成功
     * @throws This function can throw errors.
     */
    #postPlayersCommand(option, entry, ...args){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let params = ["scoreboard", "players", option, "@s", this.#id, ...args];
            let ent = entry.getEntity();
            if (ent === undefined){
                throw new InternalError("Could not find the entity");
            }
            return Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, ...params)
                .then((rt) => rt.statusCode === StatusCode.success);
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let params = ["scoreboard", "players", option, entry.displayName, this.#id, ...args];
            return Command.addParams(Command.PRIORITY_HIGHEST, ...params)
                .then((rt) => rt.statusCode === StatusCode.success);
        } else {
            throw new NameConflictError(entry.displayName);
        }
        
    }
    
    /**
     * 获取记分板项目在记分项上的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @returns {number} 记分板项目的分数
     * @throws This function can throw errors.
     */
    getScore(entry){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        try {
            return this.vanillaObjective.getScore(entry.vanillaScbid);
        } catch {
            try {
                return this.vanillaObjective.getScore(entry.update().vanillaScbid);
            } catch { return undefined; }
        }
    }
    
    /**
     * 获取在记分项上的记分板项目
     * @returns {Entry[]} 一个包含了在记分项上的记分板项目的数组
     * @throws This function can throw errors.
     */
    getEntries(){
        this.checkUnregistered();
        
        return Array
            .from(this.vanillaObjective.getParticipants())
            .map((scbid) => Entry.getEntry({scbid, type: scbid.type}) );
    }
    
    /**
     * 获取表示了在记分项上的记分板项目的分数的对象
     * @returns {ScoreInfo[]} 一个数组，包含了所有表示了在记分项上的记分板项目的分数的对象
     * @throws This function can throw errors.
     */
    getScoreInfos(){
        this.checkUnregistered();
        
        return Array.from(this.getEntries())
            .map((_)=>{
                return this.getScoreInfo(_);
            });
    }
    
    /**
     * 获取一个可以代表一个记分板项目在此记分项上的分数的对象
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {boolean} autoInit - 如果为true，且指定的记分板项目在此记分项上的分数未定义，将会设置它的分数为0
     * @returns {ScoreInfo}
     * @throws This function can throw errors.
     */
    getScoreInfo(entry, autoInit=false){
        this.checkUnregistered();
        
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);

        let scoreInfo = new ScoreInfo(this, entry);
        if (autoInit == true && scoreInfo.score == null)
            scoreInfo.score = 0;
        return scoreInfo;
    }
    
    /**
     * 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}
     */
    setScore(entry, score){
        return this.postSetScore(entry, score);
    }
    /**
     * 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}
     */
    removeScore(entry, score){
        return this.postRemoveScore(entry, score);
    }
    /**
     * 为记分板项目在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} min=-2147483647 - 随机分数的最小值
     * @param {number} max=2147483647 - 随机分数的最大值
     * @param {boolean} useBuiltIn=false - 是否在js代码层面进行随机
     * 由于实现原理以及Minecraft自身的特性，一次随机只能有2^64-1种可能，
     * 如果将最小值设置为-2147483648，并将最大值设置为2147483647
     * 随机的结果一定会是 -2147483648
     * 如果想要避免这种情况，请将此项设置为true
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}
     */
    randomScore(entry, min=-2147483647, max=2147483647, useBuiltIn=false){
        return this.postRandomScore(entry, min, max, useBuiltIn);
    }
    /**
     * 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}
     */
    resetScore(entry){
        return this.postResetScore(entry);
    }
    /**
     * 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}
     */
    addScore(entry, score){
        return this.postAddScore(entry, score);
    }
}

class ScoreInfo {
    #entry;
    #objective;
    
    /**
     * @param {Objective} obj
     * @param {Entry} entry 
     */
    constructor(obj, entry){
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
    set score(score){
        this.#objective.setScore(this.#entry, score);
    }
    
    /**
     * @type {number}
     */
    get score(){
        return this.#objective.getScore(this.#entry);
    }
    
    /**
     * 重置此对象对应的记分板项目在对应的记分项上的分数
     */
    async reset(){
        await this.#objective.postResetScore(this.#entry);
    }
    
    getEntry(){
        return this.#entry;
    }
    
    getObjective(){
        return this.#objective;
    }
    
    toString(){
        return String(this.score);
    }
    
}

export { SimpleScoreboard as Scoreboard,
     Objective,
     ScoreRangeError,
     ObjectiveUnregisteredError,
     NameConflictError,
     Entry,
     EntryType
};
export default SimpleScoreboard;
