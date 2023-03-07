import { Minecraft } from "../basis.js";
import { EntityValue } from "../entity/EntityTypeDefs.js";
import Entity from "../entity/Entity.js";
import { EntryType, EntryValueType } from "./EntryType.js";
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
export interface EntryQueryOptions {
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
     * @returns {Entity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
     */
    getEntity(): Entity;
    /**
     * If the scoreboard identity is an entity or player, returns
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity} 记分对象所对应的实体对象。
     * @throws 若实体尚未加载或已死亡，将抛出错误。
     * @throws 若记分对象不是实体类型，将抛出错误。
     */
    getVanillaEntity(): Minecraft.Entity;
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
export { Entry, EntryType };
export default Entry;
