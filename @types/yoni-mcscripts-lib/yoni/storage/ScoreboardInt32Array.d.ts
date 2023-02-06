export class ScoreboardInt32Array {
    static get [Symbol.species](): ArrayConstructor;
    constructor(objective: any, length?: number);
    /**
     * @param {Objective|Minecraft.ScoreboardObjective|string} objective - 记分项
     * @param {number} [length] - 数组长度，技术上未实现，用于数组访问
     */
    [Symbol.iterator](): any;
}
