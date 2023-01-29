import { Minecraft } from "../basis.js";
/** @enum */
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
 * @property {YoniEntity|Minecraft.Entity|Minecraft.Player} [entity]
 * @property {EntryType} [type]
 */
/**
 * Contains an identity of the scoreboard item.
 */
declare class Entry {
    #private;
    /**
     * 从可能为分数持有者的值获取其对象。
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} any - 可能为分数持有者的值
     * @returns {Entry} 与 `any` 对应的分数持有者对象。
     * @throws 若未能根据值得到可能的分数持有者对象，抛出 `UnknownEntryError`。
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
     * @returns {YoniEntity|null} 若为虚拟玩家类型的分数持有者，则返回 `null`。
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
export { Entry, EntryType };
export default Entry;
