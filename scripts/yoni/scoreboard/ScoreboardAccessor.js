import Scoreboard from "../scoreboard/SimpleScoreboard.js";
import Objective from "../scoreboard/Objective.js";
import { EntryType } from "../scoreboard/Entry.js";
import { YoniScheduler } from "../schedule.js";

const oj = new WeakMap();

export function ScoreboardAccessor(objective) {
    objective = (objective instanceof Objective) ? objective : Scoreboard.getObjective(objective);
    if (oj.has(objective)){
        return oj.get(objective);
    }
    console.log(objective);
    let caches = new Map();
    let cacheRead = new Map();
    
    //after 1t, execute function in 1t intervals, in async
    YoniScheduler.runCycleTickTask(async function (){
        if (cacheRead.size !== 0){
            cacheRead.clear();
        }
        if (caches.size === 0){
            return;
        }
        for (let kV of caches.entries()){
            caches.delete(kV[0]);
            if (kV[1] !== undefined)
                await objective.postSetScore(kV[0], kV[1]);
            else
                await objective.postResetScore(kV[0]);
        }
    }, 1, 1, true);
    let target = new Object(null);
    Object.defineProperties(target, {
        [Symbol.toStringTag]: {
            value: `ScoreboardAccessor: { objectiveId: "${objective.id}" }`
        },
        [Symbol.iterator]: {
            value: function * (){
                for (let key in Object.ownKeys(proxy)){
                    yield key;
                }
            }
        }
    });
    let proxy = new Proxy(target, {
        getPrototypeOf(target){
            return ScoreboardAccessor.prototype;
        },
        setPrototypeOf(target, prototype){
            return false;
        },
        ownKeys(target){
            return objective.getEntries()
                .filter(entry => entry.type === EntryType.FAKE_PLAYER)
                .map(entry => entry.displayName)
                .concat(Reflect.ownKeys(target));
        },
        defineProperty(target, key, descriptor){
            if (typeof key === "symbol"){
                return Reflect.defineProperty(target, key, descriptor);
            }
            let { configurable, enumerable, writable, value, get, set } = descriptor;
            caches.set(key, value);
            return true;
        },
        isExtensible(_){
            return true;
        },
        preventExtensions(_){
            return false;
        },
        getOwnPropertyDescriptor(target, key){
            if (typeof key === "symbol"){
                return Reflect.getOwnPropertyDescriptor(target, key);
            }
            let value = proxy[key];
            if (value === undefined){
                return;
            }
            return {
                "configurable": true,
                "enumerable": true,
                "writable": true,
                "value": value
            };
        },
        deleteProperty(target, key){
            if (typeof key === "symbol"){
                return Reflect.deleteProperty(target, key);
            }
            caches.set(key, undefined);
            return true;
        },
        get(target, key){
            if (typeof key === "symbol"){
                return Reflect.get(target, key);
            }
            if (caches.size !== 0 && caches.has(key)){
                return caches.get(key);
            }
            //一个读取后缓存，不确定性能怎么样，暂时不用
            //if (cacheRead.size !== 0 && cacheRead.has(key)){
            //    return cacheRead.get(key);
            //}
            let value = objective.getScore(key);
            //cacheRead.set(key, value);
            return value;
        },
        set(target, key, value){
            if (typeof key === "symbol"){
                return Reflect.set(target, key, value);
            }
            
            if (value === undefined){
                return Reflect.deleteProperty(proxy, key);
            }
            if (typeof value === "string"){
                value = Number(value);
            }
            
            if (false === Number.isInteger(value))
                throw new TypeError("not a integer numbe");
            else if (value < -2147483648 || value > 2147483647)
                throw new RangeError("number out of range from -2147483648 to 2147483647");
                
            caches.set(key, value);
            return true;
        },
        has(target, key){
            if (typeof key === "symbol"){
                return Reflect.has(target, key);
            }
            return proxy[key] !== undefined;
        }
    });
    
    oj.set(objective, proxy);
    
    return proxy;
}