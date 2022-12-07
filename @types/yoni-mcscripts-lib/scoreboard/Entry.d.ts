export default Entry;
export type EntryOption = {
    name?: string | undefined;
    id?: number | undefined;
    scbid?: any;
    entity?: Minecraft.Entity | Minecraft.Player | YoniEntity | undefined;
    type?: any;
};
/**
 * @interface
 * @typedef {Object} EntryOption
 * @property {string} [name]
 * @property {number} [id]
 * @property {Minecraft.ScoreboardIdentity} [scbid]
 * @property {YoniEntity|Minecraft.Entity|Minecraft.Player} [entity]
 * @property {EntryType} [type]
 */
/**
 * Contains an identity of the scoreboard item.
 */
export class Entry {
    /**
     * @param {Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} any
     * @returns {Entry}
     */
    static guessEntry(any: Minecraft.ScoreboardIdentity | Minecraft.Entity | Minecraft.Player | string | number | YoniEntity): Entry;
    /**
     *
     * @param {EntryOption} option
     * @returns {Entry}
     */
    static getEntry(option: EntryOption): Entry;
    /**
     * @hideconstructor
     */
    constructor(option: any);
    /**
     * Type of the scoreboard identity.
     * @returns {EntryType}
     */
    get type(): Minecraft.ScoreboardIdentityType;
    /**
     * Identifier of the scoreboard identity.
     * @returns {number}
     */
    get id(): number;
    /**
     * Returns the player-visible name of this identity.
     * @returns {string}
     */
    get displayName(): string;
    /**
     * @returns {Minecraft.ScoreboardIdentity|undefined}
     */
    get vanillaScbid(): any;
    /**
     * If the scoreboard identity is an entity or player, returns
     * the entity that this scoreboard item corresponds to.
     * @returns {Minecraft.Entity}
     */
    getEntity(): Minecraft.Entity;
    /** @returns {Entry} Returns self, after update the vanillaScbid record */
    update(): Entry;
    #private;
}
export type EntryType = Minecraft.ScoreboardIdentityType;
export namespace EntryType {
    const PLAYER: any;
    const ENTITY: any;
    const FAKE_PLAYER: any;
}
import { Minecraft } from "../basis.js";
import { YoniEntity } from "../entity.js";
