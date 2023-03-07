import { Entry } from "./Entry.js";
import { Objective } from "./Objective.js";
/**
 * 一个对象，包含了分数持有者，以及其在某一记分项上的分数。
 * @deprecated 无法保证某些属性可以正常工作。
 */
export declare class ScoreInfo {
    #private;
    /**
     * @param {Objective} obj
     * @param {Entry} entry
     */
    constructor(obj: Objective, entry: Entry);
    /**
     * @param {number} score
     */
    set score(score: number | undefined);
    /**
     * 分数持有者在记分项上的分数
     * @type {number}
     */
    get score(): number | undefined;
    /**
     * 重置此对象对应的分数持有者在对应的记分项上的分数。
     */
    reset(): Promise<void>;
    getEntry(): Entry;
    getObjective(): Objective;
    toString(): string;
}
