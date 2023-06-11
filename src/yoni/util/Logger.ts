// @ts-nocheck
import { VanillaWorld } from "../basis.js";
import { visualizeValue } from "./console.js";
import { Command } from "../command.js";
import { dealWithCmd } from "../lib/utils.js";

import {
    outputContentLog,
    debug,
    logLevel as configLogLevel,
    overrideDefaultConsole
} from "../config.js";

async function send(receiver, message){
    //if (receiver.tell){ return receiver.tell(dealWithCmd(message, message)); }; //不走sendMessage因为怕输出太多
    let rawtext = JSON.stringify({rawtext:[{text: message}]}, dealWithCmd);
    await Command.addExecute(Command.PRIORITY_HIGH, receiver, `tellraw @s ${rawtext}`);
}

function formatAnyValue(v: any){
    return typeof v === "string" ? v : visualizeValue(v, 1, {
      showEnumerableOnly: true,
      maxItemPerObject: 4,
      recursiveQuery: false,
      // recursiveQuery: true, //不开，因为会出奇怪的问题。
      // recursiveQueryDepth: 1, //未实现
    });
}

let isNoticeLoggerUsage = false;

let specificTag = "yoni:console";

export let originalConsole = console;

globalThis.originalConsole = originalConsole;

let outputToConsole = (()=>{
    return function (...args){
        originalConsole.warn(...args);
    };
})();

export let logLevel = configLogLevel;

function getTimeString(){
    let now = new Date();
    let H = now.getHours();
    let M = now.getMinutes();
    let S = now.getSeconds();
    let MS = now.getMilliseconds();
    
    let str = "";
    for (let s of [H, M, S]){
        if (str!=="") str+=":";
        str += ("00"+s).substring((""+s).length);
    }
    str += "." + (MS+"00").slice(0, 3);
    return str;
}

/*
function getTimeString(){
    let now = new Date();
    let H = now.getHours();
    let M = now.getMinutes();
    let S = now.getSeconds();
    let MS = now.getMilliseconds();
    let Y = now.getFullYear();
    let Mo = now.getMonth() + 1;
    let D = now.getDate();
    
    let str = "";
    for (let s of [H, M, S]){
        if (str!=="") str+=":";
        str += ("00"+s).substring((""+s).length);
    }
    str += "." + String(MS+"00").slice(0, 3);
    return String(Y) + "-" + ("0"+String(Mo)).slice(0,2) + "-" + ("0"+String(D)).slice(0,2) + " " + str;
}
*/
const levels = {
    0: "FATAL",
    1: "ERROR",
    2: "WARNING",
    3: "INFO",
    4: "DEBUG",
    5: "TRACE",
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
    f: "fatal",
    e: "error",
    w: "warn",
    i: "info",
    d: "debug",
    t: "trace",
    warning: "warn",
    err: "error",
    fail: "error",
    ex: "error",
    notice: "warn",
    log: "info",
    severe: "error"
}

function getLevelName(level=4){
    let c = 0;
    let o = level;
    while (level in levels || isFinite(level)){
        if (c++ > 5){
            return o;
        }
        level = levels[level];
    }
    return level;
}

function getLevelCode(level="debug"){
    let c = 0;
    while (!isFinite(level)){
        if (c++ > 5){
            return 6;
        }
        level = levels[level];
    }
    return level;
}

function transferHolder(msg, ...replacer){
    msg = msg.replace(/\{\}/g, (match, offset, string) => {
        if (replacer.length > 0)
            match = formatAnyValue(replacer.shift());
        
        return match;
    });
    if (replacer.length > 0){
        replacer.forEach(v => {
            msg += " " + formatAnyValue(v);
        });
    }
    
    return msg;
}

async function printLog(time, level, msg, ...rps){
    let consoles = [...VanillaWorld.getPlayers({tags:[specificTag]})];
    //没人接收的话干嘛要输出
    //如果输出等级设置为LOG，则可能是通过console.log输出的日志，所以会输出到日志
    if (consoles.length === 0 && !outputContentLog && level !== "LOG"){
        if (debug && !isNoticeLoggerUsage){
            isNoticeLoggerUsage = true;
            say(`添加标签 ${specificTag} 以获得日志输出`);
        }
        return;
    }
    let levelName = getLevelName(level);
    
    msg = transferHolder(msg, ...rps);
    let outputText = "[{} {}]{}";
    outputText = transferHolder(outputText, time, levelName, msg);
    
    if (outputContentLog || level === "LOG"){
        outputToConsole(outputText);
    }
    
    outputText = "§中" + outputText;
    
    consoles.forEach(pl=>send(pl, outputText));
    
}
    
export class Logger {
    static LEVEL_FATAL = 0;
    static LEVEL_ERROR = 1;
    static LEVEL_WARN = 2;
    static LEVEL_INFO = 3;
    static LEVEL_DEBUG = 4;
    static LEVEL_TRACE = 5;
    
    static log(...args){
        let time = getTimeString();
        printLog(time, "LOG", ...args);
    }
    
    /**
     * 以指定的等级输出日志。
     */
    [n: string]: (...args: any[]) => void;
    
    constructor(name=""){
        const log = async (lv, msg="", ...rps)=>{
            let time = getTimeString();
            if (msg !== "" && rps.length === 0){
                msg = transferHolder("{}", msg);
            }
            if (name.trim() !== ""){
                msg = "[{}]: " + msg;
                printLog(time, lv, msg, name, ...rps);
            } else {
                printLog(time, lv, msg, ...rps);
            }
        };
        const levelOutputs = {};
        const getOutput = (prop)=>{
            let lv = getLevelCode(prop);
            return (...args)=>{
                if (lv > logLevel) return;
                log(lv, ...args);
            };
        };
        const getValues = () => {
             return Object.keys(levelOutputs).values();
        }
        Object.keys(levels).forEach((key)=>{
            levelOutputs[key] = getOutput(key);
        });
        levelOutputs[Symbol.iterator] = getValues;
        return new Proxy(levelOutputs, {
            get: (levelOutputs, prop)=>{
                if (typeof prop === "symbol"){
                    return levelOutputs[prop];
                } else if (Object.prototype.hasOwnProperty.call(levelOutputs, prop)){
                    return levelOutputs[prop];
                } else {
                    return getOutput(prop);
                }
            }
        });
    }
}

export default Logger;

export const log = Logger.log;

const defaultLogger = new Logger("LOG");

export { defaultLogger as console };

if (overrideDefaultConsole){
    //修改原本的console
    globalThis.console = defaultLogger;
    globalThis.print = log;
}

if (debug)
import("../util/ChatCommand.js")
.then(m=>{
    m.ChatCommand.registerPrefixCommand("$", "log", (sender, rawCommand, label, args)=>{
        if (!debug) return;
        let action;
        if (args.length === 0){
            if (sender.hasTag(specificTag))
                action = "off";
            else action = "on";
        } else if (args[0] === "level"){
            if (Number.isInteger(Number(args[1]))){
                logLevel = Number(args[1]);
                sender.sendMessage("输出等级已调整为 "+logLevel);
            } else {
                sender.sendMessage("不是整数");
            }
            return;
        } else if (args[0] === "off" || !args[0]){
            action = "off";
        } else {
            action = "on";
        }
        
        if (action === "on"){
            sender.sendMessage("日志输出开启");
            sender.addTag(specificTag);
        } else {
            sender.sendMessage("日志输出关闭");
            sender.removeTag(specificTag);
        }
                
    });
});