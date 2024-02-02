import { Minecraft } from "../basis.js";
import type { ScoreboardEntry } from "./ScoreboardEntry.js";
import type { EntityValue } from "../types";

/**
 * 可以被作为分数持有者的类型。
 * 这包括原版的实体对象，yoni的实体对象，原版的scbid，yoni的Entry，以及虚拟玩家名称。
 */
export type EntryValueType = ScoreboardEntry | Minecraft.ScoreboardIdentity | EntityValue | string;

export enum EntryType {
    /**
     * 玩家类型的分数持有者。
     */
    PLAYER = Minecraft.ScoreboardIdentityType.Player,
    /**
     * 实体类型的分数持有者。
     */
    ENTITY = Minecraft.ScoreboardIdentityType.Entity,
    /**
     * 记分板虚拟玩家类型的分数持有者。
     */
    FAKE_PLAYER = Minecraft.ScoreboardIdentityType.FakePlayer,
}
