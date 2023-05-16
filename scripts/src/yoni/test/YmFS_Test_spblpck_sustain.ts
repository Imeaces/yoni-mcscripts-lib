import { initializeInfoOfVolume } from "../ymfs/initializing/initializeInfoOfVolume.js";
import { Volume } from "../ymfs/disk/Volume.js";
import { YoniScheduler, Command, console as logger, World, globalThis, Location,  } from "../yoni-mcscripts-lib";
let steps: (() => (void | Promise<any>))[] = [];

let failed = false;
let scheduleId = YoniScheduler.runCycleTickTask(async function (){
    if (failed || steps.length === 0){
        YoniScheduler.removeSchedule(scheduleId);
        return;
    }
    failed = true;
    await steps[0]();
    steps.shift();
    failed = false;
}, 5, 5, true);

let volume: Volume;
steps.push(async () => {
    let _commandResult: any = undefined;
    let volumeArea = {
        dimension: World.getDimension(0),
        begin: new Location(1234, 72, 4321),
        x: 3, y: 5, z: 2
    };
    let baseLocation = volumeArea.begin;
    
    let cmd1 = Command.getCommand("execute positioned", baseLocation.x, baseLocation.y, baseLocation.z, "run", "fill", "~", "~", "~",
        "~"+(volumeArea.x-1), 
        "~"+(volumeArea.y-1), 
        "~"+(volumeArea.z-1), 
        "air");
    
    console.debug(cmd1);
    
    _commandResult = await Command.fetchExecute(volumeArea.dimension, cmd1);
    
    let cmd2 = Command.getCommand("execute positioned", baseLocation.x, baseLocation.y, baseLocation.z, "run", "fill", "~", "~", "~",
        "~"+(volumeArea.x-1), 
        "~"+(volumeArea.y-1), 
        "~"+(volumeArea.z-1), 
        "barrel");
    
    console.debug(cmd2);
    
    //throw new Error("运行已结束");
    
    _commandResult = await Command.fetchExecute(volumeArea.dimension, cmd2);
    
    if (_commandResult.statusCode !== 0)
        throw new Error("未能填充区域");
    
    volume = new Volume({
        dimension: volumeArea.dimension,
        begin: volumeArea.begin,
        end: volumeArea.begin.add(volumeArea).subtract([1,1,1]),
    });
    
    let totalChunkCount = 0;
    let totalBlockCount = 0;
    for (let _i = 0; _i < volume.size; _i++){
        let chunk = volume.getChunk(_i);
        
        globalThis._ = chunk;
        
    
        logger.debug(chunk.mblock.location.toString());
        
        for (let _j = 0; _j < chunk.size; _j ++){
            globalThis.__ = chunk.getBlock(_j);
            totalBlockCount ++;
            await 2;
        }
        
        totalChunkCount++;
        
        await 1;
    }
    logger.info("totalChunkCount: {}, totalBlockCount: {}", totalChunkCount, totalBlockCount);
});

steps.push(() => {
    
    let nblock = volume.getChunk(0);
    globalThis.nblock = nblock;
    for (let i = 0; i < nblock.size; i++)
        nblock.getBlock(i).setDataStr("");
    
    initializeInfoOfVolume(volume.getChunk(0), volume);
    
    logger.info("successfully initialized spchunk");
});