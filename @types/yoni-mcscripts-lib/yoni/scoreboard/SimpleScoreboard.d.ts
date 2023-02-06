import { Minecraft } from "../basis.js";
import Objective from "./Objective.js";
import { Entry } from "./Entry.js";
import { EntryValueType } from "./EntryType.js";
/**
 * 可用的显示位。
 */
export declare enum DisplaySlot {
    /**
     * 在暂停菜单中显示。
     */
    list = "list",
    /**
     * 在屏幕右侧显示。
     */
    sidebar = "sidebar",
    /**
     * 在玩家名字下方显示。
     */
    belowname = "belowname"
}
/**
 * 记分项中每条项目的排序方式。
 */
export declare enum ObjectiveSortOrder {
    /**
     * 以正序排列项目（A-Z）。
     */
    "ascending" = "ascending",
    /**
     * 以倒序排列项目（Z-A）。
     */
    "descending" = "descending"
}
/**
 * 描述了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptions
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective} objective - 显示的记分项。
 */
/**
 * 描述了显示位上显示的记分项，以及显示方式。
 */
export interface DisplayOptions {
    /**
     * 显示的记分项。可能不存在。
     */
    objective: Objective | null;
    /**
     * 记分项的项目显示在此位置上时，项目排序的方式。
     */
    sortOrder?: ObjectiveSortOrder;
}
/**
 * 定义了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptionsDefinition
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 显示的记分项。
 */
/**
 * 定义了显示位上显示的记分项，以及显示方式。
 */
export interface DisplayOptionsDefinition {
    /**
     * 显示的记分项。允许使用记分项的名称，但对应的记分项必须已被创建。
     */
    objective: Objective | Minecraft.ScoreboardObjective | string;
    /**
     * 记分项的项目显示在此位置上时，项目排序的方式。
     */
    sortOrder?: ObjectiveSortOrder;
}
/**
 * 记分板包括了记分项，分数持有者以及他们的分数。
 */
export default class SimpleScoreboard {
    #private;
    /**
     * 在记分板上添加新的记分项。
     * @param {string} name - 新的记分项的名称（标识符）。
     * @param {string} criteria - 记分项的准则，永远都应该是 `"dummy"`。
     * @param {string} [displayName] - 为新添加的记分项指定显示名称，
     * 若不指定则将 `name` 作为显示名称。
     * @returns {Objective} 添加的记分项的对象。
     * @throws 若准则不为 `"dummy"` ，抛出错误。
     * @throws 若 `name` 指定的记分项已经存在，抛出错误。
     */
    static addObjective(name: string, criteria?: string, displayName?: string): Objective;
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，可以直接指定记分项的名称。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(nameOrObjective: string | Objective | Minecraft.ScoreboardObjective): boolean;
    /**
     * 获取名称为 `name` 的记分项对象。
     * @param {string|Minecraft.ScoreboardObjective} name - 可以代表记分项的值。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns {Objective} 名称为 `name` 的记分项。
     * 若不存在名称为 `name` 的记分项，且未设置 `autoCreateDummy` 为 `true`，返回 `null`。
     * 若不存在名称为 `name` 的记分项，且设置了 `autoCreateDummy` 为 `true`，创建名称为 `name` 的记分项，并返回其对象。
     */
    static getObjective(name: string | Minecraft.ScoreboardObjective, autoCreateDummy?: boolean): Objective;
    /**
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives(): Objective[];
    /**
     * 获得显示位上正在显示的内容的信息。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {DisplayOptions} - 显示位上显示的内容。
     */
    static getDisplayAtSlot(slot: DisplaySlot): DisplayOptions;
    /**
     * 设置显示位上显示的记分项，并允许额外的设置。
     * @param {DisplaySlot} slot - 显示位。
     * @param {DisplayOptionsDefinition} settings - 显示位的设置。
     * @returns {Objective} 显示位先前显示的记分项的对象，若先前未显示任何记分项，返回 `undefined` 。
     */
    static setDisplayAtSlot(slot: DisplaySlot, settings: DisplayOptionsDefinition): Objective | undefined;
    /**
     * 清空显示位上正显示的记分项。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {Objective} 显示位先前显示的记分项，若无，返回 `null` 。
     */
    static clearDisplaySlot(slot: DisplaySlot): Objective | null;
    /**
     * 获取记分板上记录的所有分数持有者。
     * @returns {Entry[]}
     */
    static getEntries(): Entry[];
    /**
     * 移除记分板的所有记分项。
     */
    static removeAllObjectives(): void;
    /**
     * 以异步方式重置分数持有者的分数。
     * @param {(entry: Entry) => boolean} [filter] - 可选的过滤器函数，
     * 将所有分数持有者的 `Entry` 对象依次传入，若得到 `true` ，则重置
     * 此分数持有者的分数，否则将不会重置。
     * @returns {Promise<number>} 重置了多少分数持有者的分数。
     */
    static postResetAllScores(filter?: (entry: Entry) => boolean): Promise<number>;
    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @param {EntryValueType} one - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static postResetScore(one: EntryValueType): Promise<void>;
}
export { SimpleScoreboard };
