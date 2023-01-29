import * as Minecraft from "@minecraft/server";
/** @enum {En} */
declare const EntryType: {
    PLAYER: Minecraft.ScoreboardIdentityType;
    ENTITY: Minecraft.ScoreboardIdentityType;
    FAKE_PLAYER: Minecraft.ScoreboardIdentityType;
};
/**
 * @interface
 * @typedef EntryOption
 * @property {string} [name]
 * @property {number} [id]
 * @property {Minecraft.ScoreboardIdentity} [scbid]
 * @property {Minecraft.Entity|Minecraft.Player} [entity]
 * @property {EntryType} [type]
 */
/**
 * Contains an identity of the scoreboard item.
 */
declare class Entry {
    #private;
    /**
     * 从可能为分数持有者的值获取其对象。
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} any - 可能为分数持有者的值
     * @returns {Entry} 与 `any` 对应的分数持有者对象。
     * @throws {UnknownEntryError} 若未能根据值得到可能的分数持有者对象。
     */
    static guessEntry(any: any): any;
    /**
     * 根据 `option` 接口获得分数持有者对象。
     * @param {EntryOption} option
     * @returns {Entry}
     */
    static getEntry(option: any): any;
    /**
     * 根据 `option` 获得原始分数持有者对象（需要启用 `useOptionalFasterCode`）。
     * @function getVanillaScoreboardParticipant
     * @param {EntryOption} option
     * @returns {Minecraft.ScoreboardIdentity}
     */
    static getVanillaScoreboardParticipant(): void;
    /**
     * 分数持有者的类型
     * @returns {EntryType}
     */
    get type(): any;
    /**
     * 分数持有者的标识符
     * @returns {number}
     */
    get id(): any;
    /**
     * 一个“玩家可见的”名称
     * @returns {string}
     */
    get displayName(): any;
    /**
     * 原始分数持有者对象，可能为空。
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid(): any;
    /**
     * 如果此分数持有者不是虚拟玩家，返回此分数持有者对应实体的对象。
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity(): any;
    /**
     * If the scoreboard identity is an entity or player, returns
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     */
    getVanillaEntity(): any;
    /**
     * 更新此分数持有者对象与原始分数持有者对象的映射关系。
     * @returns {Entry} 更新完成后，返回对象自身。
     */
    update(): this;
    /**
     * @hideconstructor
     */
    constructor(option: any);
}
/**
 * 错误：值不能作为分数。
 */
declare class ScoreRangeError extends RangeError {
    name: string;
    message: string;
}
/**
 * 错误：记分项已从记分板上移除。
 */
declare class ObjectiveUnregisteredError extends Error {
    name: string;
    constructor(name: any);
}
/**
 * 错误：虚拟玩家名称与游戏中正在游玩的玩家拥有相同的名字，无法为虚拟玩家设置分数。
 */
declare class NameConflictError extends Error {
    name: string;
    constructor(name: any);
}
/**
 * 错误：无法从可能的记分持有者的值得到记分持有者对象。
 */
declare class UnknownEntryError extends Error {
    name: string;
    message: string;
}
/**
 * 可用的显示位。
 * @enum
 */
declare const DisplaySlot: {
    /**
     * 在暂停菜单中显示。
     */
    list: string;
    /**
     * 在屏幕右侧显示。
     */
    sidebar: string;
    /**
     * 在玩家名字下方显示。
     */
    belowname: string;
};
/**
 * 记分项中每条项目的排序方式。
 * @enum
 */
declare const ObjectiveSortOrder: {
    /**
     * 以正序排列项目（A-Z）。
     */
    ascending: string;
    /**
     * 以倒序排列项目（Z-A）。
     */
    descending: string;
};
/**
 * 描述了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptions
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective} objective - 显示的记分项。
 */
/**
 * 定义了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptionsDefines
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 显示的记分项。
 */
/**
 * 记分板包括了记分项，分数持有者以及他们的分数。
 */
declare class SimpleScoreboard {
    #private;
    /**
     * 在记分板上添加新的记分项。
     * @param {string} name - 新的记分项的名称（标识符）。
     * @param {string} criteria - 记分项的准则，永远都是 `"dummy"` 。
     * @param {string} [displayName] - 为新添加的记分项指定显示名称，
     * 若不指定则将 `name` 作为显示名称。
     * @returns {Objective} 添加的记分项的对象。
     * @throws 若准则不为 `"dummy"` ，抛出错误。
     * @throws 若 `name` 指定的记分项已经存在，抛出错误。
     */
    static addObjective(name: any, criteria?: string, displayName?: any): Objective;
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，
     * 字符串将作为记分项的标识符。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(nameOrObjective: any): boolean;
    /**
     * 获得记分项对象。
     * @param {string|Minecraft.ScoreboardObjective} name - 可以得到对应记分项的值。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns {Objective|null} 若不存在由 `name` 指定的记分项，返回 `null` 。
     */
    static getObjective(name: any, autoCreateDummy?: boolean): null;
    /**
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives(): null[];
    /**
     * 获得显示位上正在显示的内容的信息。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {DisplayOptions} - 显示位上显示的内容。
     */
    static getDisplayAtSlot(slot: any): {
        objective: null;
    };
    /**
     * @private
     */
    static _getIdOfObjective(any: any): any;
    /**
     * 设置显示位上显示的记分项，并允许额外的设置。
     * @param {DisplaySlot} slot - 显示位。
     * @param {DisplayOptionDefines} settings - 显示位的设置。
     * @returns {Objective} 显示位先前显示的记分项的对象，若先前未显示任何记分项，返回 `undefined` 。
     */
    static setDisplayAtSlot(slot: any, settings: any): null | undefined;
    /**
     * 清空显示位上正显示的记分项。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {Objective} 显示位先前显示的记分项，若无，返回 `null` 。
     */
    static clearDisplaySlot(slot: any): null;
    /**
     * 返回记分板上记录的所有分数持有者。
     * @returns {Entry}
     */
    static getEntries(): any[];
    /**
     * 移除记分板的所有记分项。
     */
    static removeAllObjectives(): void;
    /**
     * 以异步方式重置分数持有者的分数。
     * @param {(entry:Entry) => boolean} [filter] - 可选的过滤器函数，
     * 将所有分数持有者的 `Entry` 对象依次传入，若得到 `true` ，则重置
     * 此分数持有者的分数，否则将不会重置。
     * @returns {Promise<number>} 重置了多少分数持有者的分数。
     */
    static postResetAllScores(filter?: null): Promise<any>;
    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static postResetScore(entry: any): Promise<void>;
}
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
     * @throws {ObjectiveUnregisteredError} 当此对象对应的记分项被移除时。
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
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    postAddScore(entry: any, score: any): Promise<void>;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
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
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    postRandomScore(entry: any, min?: number, max?: number, useBuiltIn?: boolean): Promise<any>;
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    postRemoveScore(entry: any, score: any): Promise<void>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
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
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @returns {Promise<number>} 由 `score` 指定的新分数。
     * 完成操作后，将会敲定并返回 `score`。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    postSetScore(entry: any, score: any): Promise<any>;
    /**
     * 异步获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {Promise<number>} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    postGetScore(entry: any): Promise<any>;
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
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
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     * @throws {ObjectiveUnregisteredError} 当此对象对应的记分项被移除时。
     */
    getScoreInfo(entry: any, autoInit?: boolean): ScoreInfo;
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postSetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    setScore(entry: any, score: any): Promise<any>;
    /**
     * 为分数持有者在记分项上减少分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRemoveScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    removeScore(entry: any, score: any): Promise<void>;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
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
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    randomScore(entry: any, min?: number, max?: number, useBuiltIn?: boolean): Promise<any>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    resetScore(entry: any): Promise<void>;
    /**
     * 为分数持有者在记分项上增加分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postAddScore}。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number} entry - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws {ScoreRangeError} 若分数不在可用的范围。
     */
    addScore(entry: any, score: any): Promise<void>;
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
export { SimpleScoreboard as Scoreboard, Objective, Entry, };
export { ObjectiveUnregisteredError, NameConflictError, UnknownEntryError, ScoreRangeError, };
export { DisplaySlot, ObjectiveSortOrder, EntryType, };
export default SimpleScoreboard;
