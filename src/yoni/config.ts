/* 以下为配置区 */

//设置为true后，将启用一些debug功能
//请勿在正式投入使用时启用
export const debug = true;

const loggingConfig = {
    playerConsoleSpecificTag: "yoni:console",
    
    //是否覆盖默认的console对象为Logger对象
    overrideDefaultConsole: true,
    
    showTimeString: false,
    showTimeStringOnConsoleOutput: true,
    
    //日志输出等级
    //0: none, 1: fatal, 2: error, 3: warn, 4: debug, 5: trace
    logLevel: 3,
    
    uniqueFontSize: true,
    
    //是否将日志输出到ContentLog
    outputToConsole: true,
}

//如果为true，启用一些可能可以加快运行速度的代码
//（可能不够稳定）
export const useOptionalFasterCode = true;

export const disableDangerousCode = false;

//启用根据数字ID查询scbid的功能（不推荐）
export const enableScoreboardIdentityByNumberIdQuery = false;






/* 以下为非配置区 */
import { Config } from "./util/Config.js";

export function isDebug(){
    return config.getBoolean("debug");
}

export function getConfig(key: string){
    return config.get(key);
}
export function setConfig(key: string, value: any){
    return config.set(key, value);
}

export const config = Config.createFromObject({
    debug,
    "yoni-mcscripts-lib": { injectGlobal: false },
    enableScoreboardIdentityByNumberIdQuery,
    logging: loggingConfig
});