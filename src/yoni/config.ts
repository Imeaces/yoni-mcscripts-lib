/* 以下为配置区 */

//设置为true后，将启用一些debug功能
//请勿在正式投入使用时启用
export const debug = false;

const loggingConfig = {
    playerConsoleSpecificTag: "yoni:console",
    
    //是否覆盖默认的console对象为Logger对象
    overrideDefaultConsole: true,
    
    showTimeString: false,
    showTimeStringOnConsoleOutput: true,
    
    //日志输出等级
    //-1: none, 0: fatal, 1: error, 2: warn, 3: info, 4: debug, 5: trace
    logLevel: 3,
    
    uniqueFontSize: true,
    
    //是否将日志输出到ContentLog
    outputToConsole: true,
}

const command = {
    //在Command中使用runCommand()代替runCommandAsync()
    //这可以大幅提升命令执行速度，但是可能会出现一些其他问题
    useSyncExecutorOnAsyncExecute: true,
    
    executor: { "re-execute-throws": false },
    asyncExecutor: { "re-execute-when-no-promise": true },
};


const scheduler = {
    //允许的遗留任务数量，当遗留任务的数量超出此设置值时，会放弃执行
    maxLegacyTaskCount: 30,
};

const events = {
    enableLegacyCustomEvents: false
};

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
    scheduler,
    command,
    events,
    "yoni-mcscripts-lib": { injectGlobal: false },
    enableScoreboardIdentityByNumberIdQuery,
    logging: loggingConfig
});
