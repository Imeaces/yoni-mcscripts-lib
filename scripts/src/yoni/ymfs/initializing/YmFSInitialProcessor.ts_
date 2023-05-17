import { VolumeArea } from "../disk/VolumeArea.js";
import { Location } from "../../Location.js";
import { Volume } from "../disk/Volume.js";
import { Command } from "../../command.js";
import { Minecraft } from "../../basis.js";
import { splitCube } from "../util/splitCube.js";

export class YmFSInitialProcessor {
    area: VolumeArea;
    name: string = "untitled";
    volume: Volume;
    constructor(volume: Volume, name?: string){
        this.volume = volume;
        this.area = volume.volumeArea;
        if (name)
            this.name = name;
        if (this.volume.size < 2)
            throw new Error("Volume too small");
    }
    async formatFsArea(){
        await this.fillArea();
    }
    async fillArea(){
        let cubes = splitCube(this.area, 8192);
        let block = Minecraft.MinecraftBlockTypes.chest;
        for (let cube of cubes){
            this.area.dimension.fillBlocks(
                cube.begin,
                
                new Location(cube.begin)
                    .add(cube)
                    .subtract([1, 1, 1]),
                    
                block
            );
            await 1; //pause
        }
    }
    async addTickingArea(): Promise<boolean> {
        let { x: x0, y: y0, z: z0 } = this.area.begin;
        let { x, y, z } = this.area;
        return Command.addExecute(Command.PRIORITY_HIGHEST, this.area.dimension, Command.getCommand("tickingarea add",
            x0, y0, z0,
            "~"+String(x-1), "~"+String(y-1), "~"+String(z-1),
            this.name)
        )
        .then(result => {
            if (result.statusCode === 0)
                return true;
            else
                return false;
        });
    }
}
