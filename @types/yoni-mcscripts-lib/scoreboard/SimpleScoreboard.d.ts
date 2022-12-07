/**
 * of alive display slot
 */
export type DisplaySlotType = enum;
export namespace DisplaySlotType {
    const list: DisplaySlot;
    const sidebar: DisplaySlot;
    const belowname: DisplaySlot;
}
export namespace ObjectiveSortOrder {
    const ascending: SortOrder;
    const descending: SortOrder;
}
/**
 * @interface
 * 与显示位置有关的类型
 * @typedef {Object} DisplayOptions
 * @property {SortOrder} [sortOrder] - 如果可能，在此位置上排序使用的方式
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 此位置上显示的记分项
 */
/**
 * Contains objectives and participants for the scoreboard.
 */
export default class SimpleScoreboard {
    /**
     * @type {Map<string, Objective>}
     */
    static "__#9@#objectives": Map<string, Objective>;
    /**
     * Adds a new objective to the scoreboard.
     * @param {string} name - name of new objective
     * @param {string} criteria - criteria of new objective, current only accept "dummy"
     * @param {string} displayName - displayName of new
     * objective, default is equals to name
     * @returns {Objective} new objective
     * @throws This function can throw errors.
     */
    static addObjective(name: string, criteria?: string, displayName?: string): Objective;
    /**
     * @remarks Removes an objective from the scoreboard.
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - objectiveId or Objective
     * @throws Throws when cannot determine the objective
     */
    static removeObjective(nameOrObjective: string | Objective | Minecraft.ScoreboardObjective): void;
    /**
     * Returns a specific objective (by id).
     * @param {string} name - objectiveId
     * @param {boolean} autoCreateDummy - if true, it will try to create a dummy objective when objective didn't exist
     * @returns {?Objective} return Objective if existed, else return null
     */
    static getObjective(name: string, autoCreateDummy?: boolean): Objective | null;
    /**
     * @remarks
     * Returns all defined objectives.
     * @returns {Objective[]} an array contains all defined objectives.
     */
    static getObjectives(): Objective[];
    /**
     * Returns an objective that occupies the specified display
     * slot.
     * @param {DisplaySlot} slot
     * @returns {DisplayOptions}
     * @throws This function can throw errors.
     */
    static getDisplayAtSlot(slot: DisplaySlot): DisplayOptions;
    static "__#9@#getIdOfObjective"(any: any): any;
    /**
     * @remarks
     * 在指定位置上显示记分项
     * @param {DisplaySlot} slot - 位置的id
     * @param {DisplayOptions} settings - 对于显示方式的设置
     * @returns {Objective} 指定显示位置的记分项对应的对象
     */
    static setDisplayAtSlot(slot: DisplaySlot, settings: DisplayOptions): Objective;
    /**
     * @remarks
     * Clears the objective that occupies a display slot.
     * @param {DisplaySlot} slot - 位置的id
     * @returns {?Objective}
     * @throws TypeError when slot not a DisplaySlot.
     */
    static clearDisplaySlot(slot: DisplaySlot): Objective | null;
    /**
     * @remarks
     * Returns all defined scoreboard identities.
     * @returns {Entry[]}
     */
    static getEntries(): Entry[];
    /**
     * remove all objectives from scoreboard
     */
    static removeAllObjectives(): void;
    /**
     * reset scores of all participants (in asynchronously)
     * @param {(entry:Entry) => boolean} filter - particular
     * filter function, the function will be call for each
     * participants, if return true, then reset the scores of
     * participants
     * @return {Promise<number>} success count
     */
    static postResetAllScore(filter?: (entry: Entry) => boolean): Promise<number>;
    /**
     * 重置记分板上指定项目的所有分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry
     */
    static postResetScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity): Promise<void>;
}
export type DisplayOptions = {
    /**
     * - 如果可能，在此位置上排序使用的方式
     */
    sortOrder?: any;
    /**
     * - 此位置上显示的记分项
     */
    objective: Objective | Minecraft.ScoreboardObjective | string;
};
import Objective from "./Objective.js";
import Entry from "./Entry.js";
import { Minecraft } from "../basis.js";
