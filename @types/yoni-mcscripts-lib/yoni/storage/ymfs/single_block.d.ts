export class single_block extends Array<any> {
    /**
     * @param {Objective|Minecraft.ScoreboardObjective|string} objective - 记分项
     */
    constructor(objective: Objective | Minecraft.ScoreboardObjective | string, perBlockLength: any);
    get(self: any, property: any): any;
    set(self: any, property: any, value: any): boolean;
    deleteProperty(self: any, property: any): any;
    has(self: any, property: any): boolean;
    objective: any;
}
