import * as Minecraft from "@minecraft/server";
import * as Gametest from "@minecraft/server-gametest";
declare type MinecraftEntityValue = Minecraft.Entity | Minecraft.Player | Gametest.SimulatedPlayer;
declare type EntityValue = MinecraftEntityValue;
/**
 * 一系列用于查询 Entry 的信息。
 * @interface
 * @typedef EntryQueryOptions
 * @property {string} [name]
 * @property {number} [id]
 * @property {Minecraft.ScoreboardIdentity} [scbid]
 * @property {EntityBase|Minecraft.Entity} [entity]
 * @property {EntryType} [type]
 */
/**
 * 一系列用于查询记录的信息。
 */
interface EntryQueryOptions {
    /**
     * 虚拟记分板实体的名字
     */
    name?: string;
    /**
     * 分数持有者ID
     */
    id?: number;
    /**
     * 分数持有者对象
     */
    scbid?: Minecraft.ScoreboardIdentity;
    /**
     * 实体
     */
    entity?: EntityValue;
    /**
     * 类型
     */
    type?: EntryType | Minecraft.ScoreboardIdentityType;
}
/**
 * 代表记分板上 持有着一系列分数记录的对象（分数持有者）。
 */
declare class Entry {
    #private;
    /**
     * 寻找指定对象在记分板上使用的分数持有者对象。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {Entry} 与 `one` 对应的分数持有者对象。
     * @throws 若未能根据值得到可能的分数持有者对象，抛出 `UnknownEntryError`。
     */
    static guessEntry(one: EntryValueType): Entry;
    /**
     * 查找符合 `option` 中列出的条件的分数持有者对象。
     * @param {EntryQueryOptions} option
     * @returns {Entry}
     */
    static findEntry(option: EntryQueryOptions): Entry;
    /**
     * 获取所有记分标识符对象。
     * @param {EntryQueryOptions} option
     * @returns {Minecraft.ScoreboardIdentity[]}
     */
    static getVanillaScoreboardParticipants(): Readonly<Minecraft.ScoreboardIdentity[]>;
    static findVanillaScoreboardParticipant(filter: (scbid: Minecraft.ScoreboardIdentity) => boolean): Minecraft.ScoreboardIdentity | undefined;
    /**
     * 分数持有者的类型。
     * @returns {EntryType}
     */
    get type(): EntryType;
    /**
     * 分数持有者ID，如果尚未在记分板中初始化，则为 `undefined`。
     * @returns {number|undefined}
     */
    get id(): number | undefined;
    /**
     * 分数持有者的可被玩家查看的名字。
     * @returns {string}
     */
    get displayName(): string;
    /**
     * 原始分数持有者对象，可能为空。
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid(): Minecraft.ScoreboardIdentity | undefined;
    static isScbidValidity(scbid: any): boolean;
    /**
     * 检查传入的值是否为可用的分数持有者对象。若不是，则抛出错误。
     */
    static checkScbidValidity(scbid: any): boolean;
    /**
     * 更新Entry
     * @param {Entry} entry
     */
    static updateEntry(entry: Entry): void;
    /**
     * 如果此分数持有者不是虚拟玩家，返回此分数持有者对应实体的对象。
     * @returns {Minecraft.Entity} 记分对象所对应的实体对象。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     * @returns {Minecraft.Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity(): Minecraft.Entity;
    /**
     * 更新此分数持有者对象与原始分数持有者对象的映射关系。
     * @returns {Entry} 更新完成后，返回对象自身。
     */
    update(): this;
    /**
     * @hideconstructor
     */
    constructor(option: EntryQueryOptions);
}
/**
 * 可以被作为分数持有者的类型。
 * 这包括原版的实体对象，yoni的实体对象，原版的scbid，yoni的Entry，以及虚拟玩家名称，或是scbid的数字形式。
 */
declare type EntryValueType = Entry | Minecraft.ScoreboardIdentity | EntityValue | string | number;
declare enum EntryType {
    /**
     * 玩家类型的分数持有者。
     */
    PLAYER = "player",
    /**
     * 实体类型的分数持有者。
     */
    ENTITY = "entity",
    /**
     * 记分板虚拟玩家类型的分数持有者。
     */
    FAKE_PLAYER = "fakePlayer"
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
    get id(): string;
    /**
     * 记分项的准则，应该为 `"dummy"`。
     * @returns {string}
     */
    get criteria(): string;
    /**
     * 返回此记分项的玩家可见名称。
     * @returns {string}
     */
    get displayName(): string;
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
    get vanillaObjective(): Minecraft.ScoreboardObjective;
    /**
     * 将此对象对应的记分项从记分板上移除。
     */
    unregister(): void;
    /**
     * @hideconstructor
     */
    constructor(...args: [{
        scoreboard: any;
        vanillaObjective: Minecraft.ScoreboardObjective;
        name: string;
        displayName: string;
        criteria: string;
    }] | [any, string, string, string, Minecraft.ScoreboardObjective]);
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要增加的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postAddScore(one: EntryValueType, score: number): Promise<void>;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
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
     * @returns {Promise<number>|Promise<void>} 随机得到的新分数。只有在 `useBuiltIn` 被设置为 `true` 时，才会返回此结果，
     * 否则将只会返回一个 `Promise<void>`，其在完成后被敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     * @throws 若 `useBuiltIn` 为 `false` ，且 `min > max` 。
     */
    postRandomScore(one: EntryValueType, min?: number, max?: number, useBuiltIn?: boolean): Promise<number | void>;
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postRemoveScore(one: EntryValueType, score: number): Promise<void>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    postResetScore(one: EntryValueType): Promise<void>;
    /**
     * 重置所有在此记分项上的分数持有者的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 未知的命令错误。
     */
    postResetScores(): Promise<void>;
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @returns {Promise<number>} 由 `score` 指定的新分数。
     * 完成操作后，将会敲定并返回 `score`。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    postSetScore(one: EntryValueType, score: number): Promise<number>;
    /**
     * 异步获取分数持有者在记分项上的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {Promise<number>} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    postGetScore(entry: EntryValueType): Promise<number | undefined>;
    /**
     * 寻找用于在记分项上执行特定的操作的与分数持有者有关的信息。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     */
    static findCommandRequirement(one: EntryValueType): {
        name?: string;
        type: EntryType;
        entity?: EntityValue;
        scbid?: Minecraft.ScoreboardIdentity;
        entry?: Entry;
    };
    /**
     * 获取分数持有者在记分项上的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {number} 此分数持有者在记分项上的分数。若未设定，返回 `undefined`。
     */
    getScore(one: EntryValueType): number | undefined;
    /**
     * 获取在此记分项上拥有分数记录的分数持有者。
     * @returns {Entry[]} 一个包含了在记分项上的分数持有者的数组。
     */
    getEntries(): Entry[];
    /**
     * 遍历在此记分项上拥有分数记录的所有分数持有者，为其创建一个
     * `ScoreInfo` 对象，表示了这些分数持有者在此记分项上的分数。
     * @returns {ScoreInfo[]} 一个数组，包含了所有在此记分项上拥有分数记录的分数持有者的 `ScoreInfo` 对象。
     */
    getScoreInfos(): ScoreInfo[];
    /**
     * 获取一个 `ScoreInfo` 对象，表示了分数持有者以及他在此记分项上的分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {boolean} autoInit - 如果为 `true` ，且指定的分数持有者在此记分项上的分数未定义，将会设置它的分数为0。
     * @returns {ScoreInfo}
     */
    getScoreInfo(entry: EntryValueType, autoInit?: boolean): ScoreInfo;
    /**
     * 将分数持有者在记分项上的分数设置为指定的值。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要设置的分数。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    setScore(one: EntryValueType, score: number): void;
    /**
     * 为分数持有者在记分项上增加分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param score - 要增加的分数。
     * @returns 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    addScore(one: EntryValueType, score: number): void;
    /**
     * 为分数持有者在记分项上减少分数。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @param {number} score - 要减少的分数。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     * @throws 若分数不在可用的范围，抛出 `ScoreRangeError`。
     */
    removeScore(one: EntryValueType, score: number): void;
    /**
     * 为分数持有者在记分项上设置一个随机的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postRandomScore}。
     * @param {EntryValueType} one - 可能为分数持有者的值。
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
    randomScore(one: EntryValueType, min?: number, max?: number, useBuiltIn?: boolean): Promise<number | void>;
    /**
     * 在记分项上重置指定分数持有者的分数。
     * @deprecated 由于新版本移除了runCommand()，故原有的方法
     * 不再可用，请改用 {@link Objective.postResetScore}。
     * @param {EntryValueType} one - 可能为分数持有者的值。
     * @returns {Promise<void>} 执行成功后，此 `Promise` 将会敲定。
     */
    resetScore(one: EntryValueType): Promise<void>;
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
    constructor(name: string);
}
/**
 * 错误：虚拟玩家名称与游戏中正在游玩的玩家拥有相同的名字，无法为虚拟玩家设置分数。
 */
declare class NameConflictError extends Error {
    name: string;
    constructor(name: string);
}
/**
 * 错误：无法从可能的记分持有者的值得到记分持有者对象。
 */
declare class UnknownEntryError extends ReferenceError {
    name: string;
    message: string;
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
/**
 * 可用的显示位。
 */
declare enum DisplaySlot {
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
declare enum ObjectiveSortOrder {
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
interface DisplayOptions {
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
interface DisplayOptionsDefinition {
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
declare class SimpleScoreboard {
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
export { SimpleScoreboard, Entry, EntryQueryOptions, EntryType, Objective, ScoreRangeError, ObjectiveUnregisteredError, NameConflictError, UnknownEntryError, DisplayOptions, ObjectiveSortOrder, DisplaySlot, ScoreInfo, SimpleScoreboard, DisplayOptionsDefinition };
