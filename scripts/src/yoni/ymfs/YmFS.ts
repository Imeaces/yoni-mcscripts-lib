import { VolumeArea } from "./disk/VolumeArea.js";
import { Volume } from "./disk/Volume.js";
import { YoniScheduler } from "../schedule.js";
import { World } from "../world.js";
import { Location } from "../Location.js";
import { YmFSInitialProcessor } from "./initializing/YmFSInitialProcessor.js";

export class YmFS {
    /**
     * 指定是否使用异步写入。
     */
    asyncFileSystem: boolean = true;
    volumeArea: VolumeArea;
    name: string;
    async init(){
        if (this.#initialized)
            return;
        
        await this.#init();
    }
    async #init(){
        this.#volume = new Volume({
            dimension: this.volumeArea.dimension,
            begin: this.volumeArea.begin,
            end: this.volumeArea.begin
                .add(this.volumeArea)
                .subtract([1, 1, 1])
        });
        let _bool: boolean;
        let processor = new YmFSInitialProcessor(this.#volume, this.name);
        
        _bool = true;
        _bool = await processor.addTickingArea();
        if (_bool)
            await processor.formatFsArea();
        
    }
    #initialized: boolean = false;
    // @ts-ignore 由于代码逻辑，不便在constructor内初始化
    #volume: Volume = null;
    constructor(name: string, volumeArea: VolumeArea){
        this.name = name;
        this.volumeArea = volumeArea;
    }
    getFileNode(chunkIndex: number){
    }
}

const fs = (function (){
    const beginLocation = new Location("overworld", 1048576, -64, 1048576);
    const volumeSize = {x: 16, y: 384, z: 16};
    
    const area: VolumeArea = Object.assign({
        dimension: beginLocation.dimension,
        begin: beginLocation, 
    }, volumeSize);
    
    const fs = new YmFS("YmFS0", area);
    YoniScheduler.runTask(() => fs.init(), true);
    return fs;
})();

export { fs };
export default fs;
export { YmFS };
