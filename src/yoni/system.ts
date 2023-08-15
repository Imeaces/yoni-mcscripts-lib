import { MinecraftSystem, runTask, overworld, isReadonlyMode } from "./basis.js";
import { YoniScheduler } from "./schedule.js";

class System {
    run<P extends any[]>(callback: (...args: P) => void, ...args: P){
        runTask(callback, ...args);
    }
    get beforeEvents(){
        return MinecraftSystem.beforeEvents;
    }
    get afterEvents(){
        return MinecraftSystem.afterEvents;
    }
    get currentTick(){
        return MinecraftSystem.currentTick;
    }
    isReadonlyMode(): boolean {
        return isReadonlyMode();
    }
    async waitForRWMode(callback?: () => void): Promise<void> {
        if (this.isReadonlyMode()){
            let resolve: Function = () => {};
            const promise = new Promise((re) => resolve = re);
            YoniScheduler.runDelayTimerTask(resolve, 0);
            await promise;
        }
        if (callback)
            callback();
    }
    
    setInterval(callback: () => void, interval: number){
        return YoniScheduler.runCycleTimerTask(callback, interval, interval);
    }
    setTimeout(callback: () => void, timeout?: number){
        return YoniScheduler.runDelayTimerTask(callback, timeout ?? 0);
    }
    setIntervalTick(callback: () => void, intervalTick: number){
        return YoniScheduler.runCycleTickTask(callback, intervalTick, intervalTick);
    }
    setTimeoutTick(callback: () => void, timeoutTick?: number){
        return YoniScheduler.runDelayTickTask(callback, timeoutTick ?? 0);
    }
    clearInterval(id: number){
        return YoniScheduler.removeSchedule(id);
    }
    clearTimeout(id: number){
        return YoniScheduler.removeSchedule(id);
    }
    clearIntervalTick(id: number){
        return YoniScheduler.removeSchedule(id);
    }
    clearTimeoutTick(id: number){
        return YoniScheduler.removeSchedule(id);
    }
}

export const system = new System();
