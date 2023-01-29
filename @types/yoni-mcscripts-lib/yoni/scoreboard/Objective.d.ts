import { EntityBase } from "../entity.js";
/**
 * 记分项记录了参与者以及他们的分数。
 */
declare class Objective {
    #private;
    get scoreboard(): any;
    /**
     * 记分项的标识符。
     * @returns {string}
     */
    get id(): any;
    /**
     * 记分项的准则，应该为 `"dummy"`。
     * @returns {"dummy"}
     */
    get criteria(): any;
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     */
    get displayName(): any;
    /**
     * 此记分项对象是否只允许使用 `getScore()`
     * （此功能未实现）。
     * @returns {boolean} 表示是否此记分项对象只允许使用 `getScore()`。
     */
    isReadOnly(): boolean;
    /**
     * 检测此对象对应的记分项是否已经被移除。
     * @returns {boolean} 检测结果。若已被移除，返回 `true`，否则返回 `false`。
     */
    isUnregistered(): boolean;
    /**
     * 检查此对象对应的记分项是否被移除。
     * @throws 当此对象对应的记分项被移除时，抛出 `ObjectiveUnregisteredError`。
     */
    checkUnregistered(): void;
    /**
     * 原始记分项对象。
     * @returns {Minecraft.ScoreboardObjective} 原始记分项对象。
     */
    get vanillaObjective(): any;
    /**
     * 将此对象对应的记分项从记分板上移除。
     */
    unregister(): void;
    /**
     * @hideconstructor
     */
    constructor(...args: any[]);
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postAddScore(entry: any, score: any): Promise<void>;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     *
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    postRandomScore(entry: any, min?: number, max?: number, useBuiltIn?: boolean): Promise<any>;
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postRemoveScore(entry: any, score: any): Promise<void>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScore(entry: any): Promise<void>;
    /**
     * 重置所有在此记分项上的分数持有者的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScores(): Promise<void>;
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @returns {Promise<number>} 由 `score` 指定的新分数。
     * 完成操作后，将会敲定并返回 `score`。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postSetScore(entry: any, score: any): Promise<any>;
    /**
     * 异步获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<number>} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    postGetScore(entry: any): Promise<any>;
    /**
     * 为分数持有者在记分项上执行特定的操作。
     * @param {string} option - 操作类型。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {...any} args - 操作所需要的参数。
     * @throws 未知的命令错误。
     * @throws 若尝试为虚拟玩家设置分数，且世界中有相同名字的玩家时，抛出 `NameConflictError`。
     */
    __playerCommand(option: any, entry: any, ...args: any[]): void;
    /**
     * 寻找用于在记分项上执行特定的操作的与分数持有者有关的信息。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     */
    static findCommandRequirement(entry: any): {
        name?: string;
        type: string;
        entity?: EntityBase;
    };
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {number} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    getScore(entry: any): any;
    /**
     * 获取在此记分项上拥有分数记录的分数持有者。
     * @returns {Entry[]} 一个包含了在记分项上的分数持有者的数组。
     */
    getEntries(): any[];
    /**
     * 遍历在此记分项上拥有分数记录的所有分数持有者，为其创建一个
     * `ScoreInfo` 对象，表示了这些分数持有者在此记分项上的分数。
     * @returns {ScoreInfo[]} 一个数组，包含了所有在此记分项上拥有分数记录的分数持有者的 `ScoreInfo` 对象。
     */
    getScoreInfos(): ScoreInfo[];
    /**
     * 获取一个 `ScoreInfo` 对象，表示了分数持有者以及他在此记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     */
    getScoreInfo(entry: any, autoInit?: boolean): ScoreInfo;
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    setScore(entry: any, score: any): Promise<any>;
    /**
     * 为分数持有者在记分项上减少分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    removeScore(entry: any, score: any): Promise<void>;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param {number} min - 随机分数的最小值。
     * @param {number} max - 随机分数的最大值。
     * @param {boolean} [useBuiltIn] - 是否在 JavaScript 代码层面进行随机。
     *
     * 由于实现原理以及 Minecraft 自身的特性，使用 Minecraf t的随机命令时，
     * 只会有 2^64-1 种可能。
     * 如果将最小值设置为 `-2147483648`，并将最大值设置为 `2147483647`，
     * 随机的结果一定会是 `-2147483648`。
     *
     * 如果想要避免这种情况，请将此项设置为 `true`。
     * @returns {Promise<number>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    randomScore(entry: any, min?: number, max?: number, useBuiltIn?: boolean): Promise<any>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    resetScore(entry: any): Promise<void>;
    /**
     * 为分数持有者在记分项上增加分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能为分数持有者的值。
     * @param score - 要增加的分数。
     * @returns 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    addScore(entry: any, score: number): Promise<void>;
}
/**
 * 一个对象，包含了分数持有者，以及其在某一记分项上的分数。
 * @deprecated 无法保证某些属性可以正常工作。
 */
declare class ScoreInfo {
    #private;
    /**
     * @param {Objective} obj
     * @param {Entry} entry
     */
    constructor(obj: any, entry: any);
    /**
     * @param {number} score
     */
    set score(score: any);
    /**
     * @type {number}
     * 分数持有者在记分项上的分数
     */
    get score(): any;
    /**
     * 重置此对象对应的分数持有者在对应的记分项上的分数。
     */
    reset(): any;
    getEntry(): any;
    getObjective(): any;
    toString(): string;
}
export { Objective, ScoreInfo };
export default Objective;
