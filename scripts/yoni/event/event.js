import { VanillaEvents as MinecraftEvents, SystemEvents } from "yoni/basis.js";
import { debug } from "yoni/config.js";
import { Logger } from "yoni/util/Logger.js";
/**
 * 事件管理
 * 不建议移除事件，由于移除事件的机制为设空回调，导致移除事件并不是真正的移除，大量移除事件导致事件遗留，可能影响性能
 * 可能会在以后优化
 */

const logger = new Logger("Event");

/* 与事件有关的一些函数 */

function getIdentifierInfo(identifier){
    if (typeof identifier !== "string"){
        throw new TypeError("Not a string identifier");
    }
    let namespace = "custom";
    let name = null;
    let info = identifier.match(/^(?:(\S+):)?(\S+)$/m);
    if (info === null){
        throw new Error("Invalid identifier: "+identifier);
    } else if (info[2] === undefined){
        throw new Error("Could not find a name in identifier: "+identifier);
    }
    if (info[1] !== undefined){
        namespace = info[1];
    }
    name = info[2];
    return { id: identifier, name, namespace }
}

function getNameSpace(eventType){
    let eventName;
    let prefix;
    let idx = eventType.indexOf(":");
    if (idx !== -1){
        eventName = eventType.slice(idx+1, eventType.length);
        prefix = eventType.slice(0, idx);
    } else {
        eventName = eventType;
        prefix = "custom";
    }
    return { namespace: prefix, eventName: eventName };
    
}

/* 事件注册部分 */
//定义存储已注册事件的地图
let eventRegisterMap = new Map();
const registeredEventTypes = new Map();

//用于记录 已延迟的 事件的监听 的注册 的地图
let waitingEventRegisterMap = new Map();

function getNamespaceEventTypesMap(namespace){
    if (!registeredEventTypes.has(namespace)){
        registeredEventTypes.set(namespace, new Map());
    }
    return registeredEventTypes.get(namespace);
}

class EventTypes {
    static register(identifier, eventType){
        let idInfo = getIdentifierInfo(identifier);
        let namespaceMap = getNamespaceEventTypesMap(idInfo.namespace);
        if (namespaceMap.has(idInfo.name)){
            throw new Error("EventType "+idInfo.id+" already registered");
        }
        if ("subscribe" in eventType){
            if (!("unsubscribe" in eventType)){
                logger.warn("正在注册的{}事件没有一个unsubscribe属性，这可能会导致一些错误", idInfo.id);
            }
            try {
                namespaceMap.set(idInfo.name, eventType);
            } catch (err){
                throw new Error("未能注册事件，可能指定的命名空间不可修改事件\n以下是错误信息: "+String(err));
            }
            logger.trace("注册了事件 {}", idInfo.id);
        } else {
            throw new Error("在eventType上必须有一个subscribe属性才可以注册事件");
        }
    }
    static registerNamespace(namespace, namespaceEventTypes){
        if (typeof namespace === "string" || namespace.match(/[\s:]/) === null){
            throw new Error("命名空间需要是一个字符串，且不能包含空格或冒号");
        }
        if (registeredEventTypes.has(namespace)){
            throw new Error("指定的命令空间已被注册");
        }
        if ("get" in namespaceEventTypes){
            registeredEventTypes.set(namespace, namespaceEventTypes);
            logger.trace("注册了事件命名空间 {}", namespace);
        }
    }
    /**
     * @param {String} 事件的identifer
     * @returns {Boolean} 事件是否存在且已移除
     */
    static unregister(identifier){
        let idInfo = getIdentifierInfo(identifier);
        let namespaceMap = getNamespaceEventTypesMap(idInfo.namespace);
        if (namespaceMap.has(idInfo.name)){
            try {
                namespaceMap.delete(idInfo.name);
            } catch (err){
                throw new Error("未能注册事件，可能指定的命名空间不可修改事件\n以下是错误信息: "+String(err));
            }
            logger.debug("已注销事件 {}，但它仍存在于已注册的监听器中", idInfo.id);
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * @param {String} 事件的identifer
     * @returns 事件的示例，如不存在返回null
     */
    static get(identifier){
        let idInfo = getIdentifierInfo(identifier);
        let namespaceMap = getNamespaceEventTypesMap(idInfo.namespace);
        if (namespaceMap.has(idInfo.name)){
            return namespaceMap.get(idInfo.name);
        } else {
            return null;
        }
    }
    
    static getAll = function * getAll(){
        for (let namespaceMap of registeredEventTypes.values()){
            for (let eventType of namespaceMap.values()){
                yield eventType;
            }
        }
    }
}

// Minecraft事件注册
(()=>{
    let map = new Map();
    for (let s in MinecraftEvents){
        map.set(s, MinecraftEvents[s]);
        logger.trace("注册了事件minecraft:{}", s);
    }
    Object.freeze(map);
    eventRegisterMap.set("minecraft", map);
    registeredEventTypes.set("minecraft", map);
})();
// Minecraft System事件注册
(()=>{
    let map = new Map();
    for (let s in SystemEvents){
        map.set(s, SystemEvents[s]);
        logger.trace("注册了事件system:{}", s);
    }
    Object.freeze(map);
    eventRegisterMap.set("system", map);
    registeredEventTypes.set("system", map);
})();

const EVENT_SIGNAL_BUILDER_SYMBOL = Symbol();

class EventSignalBuildResult {
    fireEvent;
    triggerEvent;
    eventSignal;
    getCallbackCount;
    
    constructor(signal){
        this.fireEvent = signal.fireEvent;
        this.triggerEvent = signal.fireEvent;
        this.eventSignal = signal.eventSignal;
        this.getCallbackCount = signal.getCallbackCount;
        Object.freeze(this);
    }
    registerEvent(){
        EventTypes.register(this.eventSignal.identifier, this.eventSignal);
    }
    unregisterEvent(){
        EventTypes.unregister(this.eventSignal.identifier);
    }
}

class Event {
    constructor(values){
        if (values === undefined){
            return;
        }
        for (let key in values){
            Object.defineProperty(this, key, {
                get: function (){
                    return values[key];
                },
                set: function (val){
                    values[key] = val;
                }
            });
        }
    }
}

function isBuilderSignal(symbol){
    return symbol === EVENT_SIGNAL_BUILDER_SYMBOL;
}

class EventSignalBuilder {
    
    #eventSignalClass = EventSignal;
    
    #idInfo = null;
    #eventType = null;
    
    #eventClass = null;
    
    #firebug = null;
    static defaultFirebug(callbacks /* Array<Object{callback: <Function>, filters: <Array> }> */, eventClass /* any */, eventValues/* Array[any] */){
        callbacks.forEach((f)=>{
            f(new eventClass(...eventValues));
        });
    }
    
    #eventFilterResolver = null;
    static defaultFilterResolver(eventValue /* Array[any] */, filters, /* Array[any] */){
        return true;
    };
    
    constructor(identifier, eventSignalClass){
        if (identifier !== undefined){
            this.#idInfo = getIdentifierInfo(identifier);
        }
        if (eventSignalClass !== undefined){
            this.#eventSignalClass = eventSignalClass;
        }
    }
    id(identifier){
        if (this.#idInfo !== null){
            throw new Error("Already setup identifier");
        }
        this.#idInfo = getIdentifierInfo(identifier);
        return this;
    }
    identifier(){
        if (this.#idInfo !== null){
            throw new Error("Already setup identifier");
        }
        this.#idInfo = getIdentifierInfo(identifier);
        return this;
    }
    namespace(){
        if (this.#idInfo === null){
            throw new Error("Set a identifier first");
        }
        if (registeredEventTypes.has(n)){
            this.#idInfo.namespace = n;
        } else {
            throw new Error("Namespace not found");
        }
        return this;
    }
    eventClass(n){
        if (this.#eventType !== null){
            throw new Error("Already setup eventType, cannot setup others");
        }
        if (this.#eventClass !== null){
            throw new Error("Already setup eventClass");
        }
        this.#eventClass = n;
        return this;
    }
    eventType(n){
        if (this.#eventType !== null){
            throw new Error("Already setup eventType");
        }
        this.#eventType = n;
        return this;
    }
    filterResolver(n){
        if (this.#eventType !== null){
            throw new Error("Already setup eventType, cannot setup others");
        }
        if (this.#filterResolver !== null){
            throw new Error("Already setup filterResolver");
        }
        this.#filterResolver = n;
        return this;
    }
    build(){
        let idInfo = this.#idInfo;
        if (this.#idInfo === null){
            throw new Error("Build failed, require identifier to set");
        }
        let eventType = this.#eventType;
        let eventClass = this.#eventClass;
        let filterResolver  = this.#filterResolver;
        let firebug = this.#firebug;
        eventClass = (eventClass) ? eventClass : Event;
        filterResolver = (filterResolver) ? filterResolver : EventSignalBuilder.defalutFilterResolver;
        firebug = (firebug) ? firebug : EventSignalBuilder.defalutFirebug;
        
        let eventSignal;
        let symbol = (this.#eventSignalClass === EventSignal || this.#eventSignalClass instanceof EventSignal) ? EVENT_SIGNAL_BUILDER_SYMBOL : Symbol();
        if (eventType === null)
            eventSignal = new this.#eventSignalClass(symbol, {
                identifier: idInfo.id,
                eventClass,
                fireBug,
                filterResolver
            });
        else
            eventSignal = new this.#eventSignalClass(symbol, {
                eventType,
                identifier: idInfo.id
            });
        
        return new EventSignalBuildResult(signal);
    }
    #returnResult(signal){
        let fireEventSignal = eventSignal.fireEvent,
        delete eventSignal.fireEvent;
    }
}

class EventSignal {
    static builder(identifier){
        return new EventSignalBuilder(identifier);
    }
    static getBuilder(identifier, eventSignalClass){
        return new EventSignalBuilder(identifier, eventSignalClass);
    }
    
    #identifier;
    get identifier(){
        return this.#identifier;
    }
    
    get namespace(){
        return getIdentifierInfo(this.#identifier).namespace;
    }
    
    get eventName(){
        return getIdentifierInfo(this.#identifier).name;
    }
    
    constructor(symbol, options){
        if (!isBuilderSignal(symbol)){
            throw new Error("EventSignal constructor must invoke by a EventSignalBhilder, use EventSignal.getBuilder() to get one");
        }
        
        let {
            identifier,
            eventClass,
            fireBug,
            eventType,
            filterResolver
        } = options;
        this.#identifier = identifier;
        
        if (eventType !== undefined){
            this.subscribe = (...args)=>{
                eventType.subscribe(...args);
            };
            this.unsubscribe = (...args)=>{
                eventType.unsubscribe(...args);
            };
            return {
                eventSignal: this
            }
        }
        
        const fireEvent = (...args)=>{
            let callbacks = this.#callback.filter(e=>{
                if (e.filters === undefined)
                    return true;
                else if (filterResolver(args, e.filters))
                    return true;
                else
                    return false;
            });
            fireBug(callbacks, eventClass, args);
        };
        const getCallbackCount = (...args)=>{
            return this.#callbacks.length;
        }
        return {
            eventSignal: this,
            fireEvent,
            triggerEvent: fireEvent,
            getCallbackCount
        }
    }
    
    #callbacks = [];
    
    subscribe(callback, ...filters){
        if (typeof callback !== "function")
            throw new Error("not a function in arguments[0]");
        if (filters.length === 1)
            this.#callbacks.push({callback, filters: filters[0]});
        else if (filters.length === 0)
            this.#callbacks.push({callback});
        else
            this.#callbacks.push({callback, filters});
    }
    unsubscribe(callback){
        if (typeof callback !== "function")
            throw new Error("not a function in arguments[0]");
        this.#callbacks = this.#callbacks.filter((e)=>{
            if (e.callback === callback){
                return false;
            }
            return true;
        });
    }
}

export class EventListener {
    static #callbacks = [];
    static #index = 0;
    
    //这个方法不推荐使用，但是调试用起来是很方便
    static _getCallback(id){
        if (debug)
            return this.#callbacks[id];
    }
    
    static #callbackInterrupttedCount = (debug) ? new Map() : undefined;
    static #checkIsFireInterrupted(oid){
        if (oid !== -1){
            if (debug){
                let s = this.#callbackInterrupttedCount.get(oid);
                s = (s !== undefined) ? s+1 : 1;
                this.#callbackInterrupttedCount.set(oid, s);
                logger.warning("在回调{}时意外终止，已发生{}次", oid, s);
            } else {
                logger.warning("在回调时意外终止");
            }
        }
    }
    static #fireingCallbackId = -1;
    static #fireCallback(id, ...args){
        //this.#checkIsFireInterrupted(this.#fireingCallbackId);
        let func = this.#callbacks[id];
        if (func === null){
            return;
        }
        this.#fireingCallbackId = id;
        if (Object.prototype.toString.call(func) === "[object AsyncFunction]"){
            func(...args)
                .then(()=>{
                    logger.trace("完成了ID为 {} 的事件异步回调", id);
                })
                .catch((err)=>{
                    logger.error("尝试对事件进行ID为 {} 的异步回调时发生错误 {}", id, err);
                });
            this.#fireingCallbackId = -1;
            return;
        }
        try {
            return func(...args);
        } catch(err){
            logger.error("尝试对事件进行ID为 {} 的回调时发生错误 {}", id, err);
        }
        this.#fireingCallbackId = -1;
        return;
    }
    
    static delayRegister(...args){
        if (typeof args[0] !== "string")
            throw new Error("无法对已实例化的事件进行延迟注册");
        
        if (args[0] in Events)
            return this.register(...args);
        
        this.#delayRegister(this.#index++, ...args)
    }
    
    static #delayRegister(idx, eventType, callback, ...eventFilters){
        let ns = getNameSpace(eventType);
        let eventName = ns.namespace + ":" + ns.eventName;
        if (!waitingEventRegisterMap.has(eventName)){
            waitingEventRegisterMap.set(eventName, []);
        }
        waitingEventRegisterMap.get(eventName).push(async ()=>{
            eventType = Events[eventType];
            this.#doDelayRegister({
                eventName, idx,
                args: [ idx, eventType, callback, eventFilters]
            });
        });
        return idx - 1;
    }
    
    static #doDelayRegister(options){
        let { eventName, idx, args } = options;
        try {
            this.#doRegister(...args);
            logger.debug("已完成对事件{}的回调{}的注册", eventName, idx);
        } catch {
            logger.error("未能完成对事件{}的延迟注册回调{}", eventName, idx);
        }
    }
    
    static #doRegister(idx, eventType, callback, ...eventFilters){
        if (!(eventType?.subscribe instanceof Function)){
            const error = new Error("require a subscribe() to register event");
            logger.error("在注册id为{}的回调时发生错误 {}", idx, error);
            throw error;
        }
        if (!(callback instanceof Function)){
            const error = new TypeError("not a function");
            logger.error("在注册id为{}的回调时发生错误 {}", idx, error);
            throw error;
        }
        let fireCallback = (...args) => {
            this.#fireCallback(idx, ...args);
        };
        try {
            this.#callbacks[idx] = callback;
            eventType.subscribe(fireCallback, ...eventFilters);
            logger.trace("已成功注册id为{}的回调", idx);
        } catch (e){
            this.#callbacks[idx] = null;
            logger.error("在注册id为{}的回调时发生错误 {}", idx, e);
        }
    }
    
    /**
     * add a new callback function for specific event
     * @param {EventIdentity} caller - the event identify 
     * @param {Function} callback - callback function
     * @params args - any arguments you want, they will be transmitted directly 
     * @return {number} - id of the callback
     */
    static register(eventType, callback, ...eventFilters){
        let idx = this.#index;
        
        if (eventType?.constructor === String){
            if (eventType in Events){
                eventType = Events[eventType];
            } else {
                logger.debug("延迟id为{}的{}事件注册", this.#index, eventType);
                this.#delayRegister(this.#index, eventType, callback, ...eventFilters);
                return this.#index ++;
            }
        }
        
        this.#doRegister(idx, eventType, callback, ...eventFilters);

        return this.#index ++;
    }
    
    static unregister(id){
        if (this.#callbacks[id] !== null){
            this.#callbacks[id] = null;
            logger.debug("移除了ID为{}的回调", id);
        } else {
            let idx = this.#callbacks.indexOf(id);
            if (idx !== -1){
                this.#callbacks[idx] = null;
                logger.debug("移除了ID为{}的回调", idx);
            }
        }
    }
}

export default Events;

import('yoni/event/eventreg.js');
