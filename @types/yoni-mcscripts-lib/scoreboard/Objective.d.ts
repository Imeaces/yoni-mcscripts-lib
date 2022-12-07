export default Objective;
/**
 * 包含记分板的目标（记分项）和参与者（记分对象）。
 */
export class Objective {
    constructor(...args: any[]);
    get scoreboard(): any;
    /**
     * 记分项的标识符。
     * @returns {string}
     * @throws This property can throw when used.
     */
    get id(): string;
    /**
     * 记分项的准则
     * @throws This property can throw when used.
     */
    get criteria(): any;
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     * @throws This property can throw when used.
     */
    get displayName(): string;
    /**
     * 此记分项对象是否只允许使用getScore()
     * （此功能未实现）
     * @returns {boolean} 表示是否此记分项对象只允许使用getScore()
     */
    isReadOnly(): boolean;
    /**
     * 检测此对象对应的记分项是否已经被移除
     * @returns {boolean} 此对象对应的记分项是否已经被移除。
     */
    isUnregistered(): boolean;
    /**
     * 检查此对象对应的记分项是否被移除
     * @throws 当此对象对应的记分项被移除时抛出错误
     */
    checkUnregistered(): void;
    /**
     * 原始记分项对象
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象
     */
    get vanillaObjective(): Minecraft.ScoreboardObjective;
    /**
     * 将此对象对应的记分项从记分板上移除
     * @throws This function can throw error when objective has been unregistered.
     */
    unregister(): void;
    /**
     * 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    postAddScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    /**
     * 为记分板项目在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} min=-2147483647 - 随机分数的最小值
     * @param {number} max=2147483647 - 随机分数的最大值
     * @param {boolean} useBuiltIn=false - 是否在js代码层面进行随机。
     * 由于实现原理以及Minecraft自身的特性，一次随机只能有2^64-1种可能，
     * 如果将最小值设置为-2147483648，并将最大值设置为2147483647，
     * 随机的结果一定会是 -2147483648。
     * 如果想要避免这种情况，请将此项设置为true。
     * @returns {Promise<number>} 记分板项目的新分数
     */
    postRandomScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, min?: number, max?: number, useBuiltIn?: boolean): Promise<number>;
    /**
     * 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     */
    postRemoveScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    /**
     * 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     */
    postResetScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity): Promise<void>;
    /**
     * 重置所有在记分项上的记分板项目的分数
     */
    postResetScores(): Promise<void>;
    /**
     * 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     */
    postSetScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    /**
     * 获取记分板项目在记分项上的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @returns {number} 记分板项目的分数
     * @throws This function can throw errors.
     */
    getScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity): number;
    /**
     * 获取在记分项上的记分板项目
     * @returns {Entry[]} 一个包含了在记分项上的记分板项目的数组
     * @throws This function can throw errors.
     */
    getEntries(): Entry[];
    /**
     * 获取表示了在记分项上的记分板项目的分数的对象
     * @returns {ScoreInfo[]} 一个数组，包含了所有表示了在记分项上的记分板项目的分数的对象
     * @throws This function can throw errors.
     */
    getScoreInfos(): ScoreInfo[];
    /**
     * 获取一个可以代表一个记分板项目在此记分项上的分数的对象
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {boolean} autoInit - 如果为true，且指定的记分板项目在此记分项上的分数未定义，将会设置它的分数为0
     * @returns {ScoreInfo}
     * @throws This function can throw errors.
     */
    getScoreInfo(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, autoInit?: boolean): ScoreInfo;
    /**
     * 为记分板项目在记分项上设置指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要设置的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @throws This function can throw errors.
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}
     */
    setScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    /**
     * 为记分板项目在记分项上减少指定的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要减少的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}
     */
    removeScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    /**
     * 为记分板项目在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} min=-2147483647 - 随机分数的最小值
     * @param {number} max=2147483647 - 随机分数的最大值
     * @param {boolean} useBuiltIn=false - 是否在js代码层面进行随机
     * 由于实现原理以及Minecraft自身的特性，一次随机只能有2^64-1种可能，
     * 如果将最小值设置为-2147483648，并将最大值设置为2147483647
     * 随机的结果一定会是 -2147483648
     * 如果想要避免这种情况，请将此项设置为true
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}
     */
    randomScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, min?: number, max?: number, useBuiltIn?: boolean): Promise<number>;
    /**
     * 在记分项重置指定记分板项目的分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}
     */
    resetScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity): Promise<void>;
    /**
     * 为记分板项目在记分项上添加分数
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可以作为记分板项目的东西
     * @param {number} score - 要添加的分数
     * @returns {Promise<number>} 记分板项目的新分数
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}
     */
    addScore(entry: Entry | Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity, score: number): Promise<number>;
    #private;
}
export class ScoreInfo {
    /**
     * @param {Objective} obj
     * @param {Entry} entry
     */
    constructor(obj: Objective, entry: Entry);
    /**
     * @param {number} score
     */
    set score(arg: number);
    /**
     * @type {number}
     */
    get score(): number;
    /**
     * 重置此对象对应的记分板项目在对应的记分项上的分数
     */
    reset(): Promise<void>;
    getEntry(): Entry;
    getObjective(): Objective;
    toString(): string;
    #private;
}
import { Entry } from "./Entry.js";
import { Minecraft } from "../basis.js";
import { YoniEntity } from "../entity.js";
