import { MinecraftSystem, Minecraft } from "../basis.js";

export function WatchBird(){
    if (hasInitiated)
        return;
    
    startWatchBird();
    hasInitiated = true;
}

let hasInitiated: boolean = false;
const interruptRecord: number[] = [];

function startWatchBird(){
    MinecraftSystem.beforeEvents.watchdogTerminate.subscribe(listenEvent);
}

function listenEvent(event: Minecraft.WatchdogTerminateBeforeEvent){
    interruptRecord.unshift(Date.now());
    
    if (interruptRecord.length >= 5){
        interruptRecord.length = 5;
        
        let firstInterruptTime = interruptRecord[4];
        let lastInterruptTime = interruptRecord[0];
        
        if (lastInterruptTime - firstInterruptTime < 60 * 1000){
            console.error("WatchdogTerminate");
            return;
        }
    }
    
    event.cancel = true;
}
