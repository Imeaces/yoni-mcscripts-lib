// @ts-nocheck
/* 以下为配置区 */

//设置为true后，将启用一些debug功能
//请勿在正式投入使用时启用
export const debug = true;

//日志输出等级
//0: none, 1: fatal, 2: error, 3: warn, 4: debug, 5: trace
export const logLevel = 4;

//是否将日志输出到ContentLog
export const outputContentLog = true;

//如果为true，启用一些可能可以加快运行速度的代码
//（可能不够稳定）
export const useOptionalFasterCode = true;

export const disableDangerousCode = false;

//是否覆盖默认的console对象为Logger对象
export const overrideDefaultConsole = true;

/* 以下为非配置区 */
export function isDebug(){
    return debug;
}

//导入debug用函数
if (debug)
    import("./debug.js");
