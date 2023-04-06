import { SystemEvents } from "../basis.js";

(function (){

let interruptRecord = [];
    
SystemEvents.beforeWatchdogTerminate.subscribe((event) => {
    interruptRecord.unshift(Date.now());
    
    if (interruptRecord.length >= 5){
        interruptRecord.length = 5;
        
        let firstInterruptTime = interruptRecord[4];
        let lastInterruptTime = interruptRecord[0];
        
        if (lastInterruptTime - firstInterruptTime < 60 * 1000)
            return;
    }
    
    event.cancel = true;
});

})();

//这个比狗要温和点
