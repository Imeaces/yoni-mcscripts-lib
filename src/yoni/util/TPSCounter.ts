import { YoniScheduler } from "../schedule.js";

let tickTimeRecords: number[] = [];
let maxRecordTicks: number = 20;

YoniScheduler.runCycleTickTask(function countTPS(){
    tickTimeRecords.push(Date.now());
    
    if (tickTimeRecords.length > maxRecordTicks * 2)
        tickTimeRecords = tickTimeRecords.slice(tickTimeRecords.length - maxRecordTicks, maxRecordTicks);
}, 1, 1, false);

export class TPSCounter {
    static get maxRecordTicks(){
        return maxRecordTicks;
    }
    static set maxRecordTicks(v: number){
        v = Number(v);
        if (isNaN(v) || v < 1)
            throw new TypeError("value not valid");
        
        maxRecordTicks = Math.floor(v);
    }
    /**
     * @param recentSeconds 指定计算使用的时间长度。
     * @param tickRate 指定每秒 tick 数。
     * @returns 若过去的时间内尚无记录，返回 `-1`，否则返回计算得到的TPS。
     */
    static getTPS(recentSeconds: number = 1, tickRate: number = 20): number {
        
        if (recentSeconds * 1000 > tickTimeRecords[tickTimeRecords.length-1] - tickTimeRecords[0]){
            // not such record
            return -1;
        }
        
        const shouldPassedTicks = recentSeconds * tickRate;
        
        const totalRecordedTicks = tickTimeRecords.length - 1;
        
        const recordedTicks = Math.min(Math.floor(shouldPassedTicks), totalRecordedTicks);
        
        const oldestTickTime = tickTimeRecords[totalRecordedTicks - recordedTicks];
        const lastTickTime = tickTimeRecords[totalRecordedTicks];
        
        const intervalBetweenStartEndRecord = lastTickTime - oldestTickTime;
        
        const tickingTime = Math.max(intervalBetweenStartEndRecord, recentSeconds);
        
        const tps = 1000 / ( tickingTime / shouldPassedTicks );
        
        const normalizedTPS = Math.round(tps * 100) / 100;
        
        return normalizedTPS;
    }
}
