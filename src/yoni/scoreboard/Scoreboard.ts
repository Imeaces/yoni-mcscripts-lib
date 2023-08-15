import { StatusCode, VanillaScoreboard, Minecraft, VanillaWorld } from "../basis.js";
import { Command } from "../command.js";

import {
    NameConflictError,
    // ScoreRangeError,
    // ObjectiveUnregisteredError,
    // UnknownEntryError,
} from "./ScoreboardError.js"
import { Objective } from "./Objective.js";
import { ScoreboardEntry } from "./ScoreboardEntry.js";
import { EntryValueType, EntryType } from "./EntryType.js";

import { EntityBase } from "../entity.js";

/**
 * 可用的显示位。
 */
export enum DisplaySlot {
    /**
     * 在暂停菜单中显示。
     */
    list = Minecraft.DisplaySlotId.List,
    /**
     * 在屏幕右侧显示。
     */
    sidebar = Minecraft.DisplaySlotId.Sidebar,
    /**
     * 在玩家名字下方显示。
     */
    belowname = Minecraft.DisplaySlotId.BelowName,
}

/**
 * 记分项中每条项目的排序方式。
 */
export enum ObjectiveSortOrder {
    /**
     * 以正序排列项目（A-Z）。
     */
    "ascending" = "ascending",
    /**
     * 以倒序排列项目（Z-A）。
     */
    "descending" = "descending",
}

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
 */
export interface DisplayOptionsDefinition {
    /**
     * 显示的记分项。允许使用记分项的名称，但对应的记分项必须已被创建。
     */
    objective: Objective|Minecraft.ScoreboardObjective|string;
    /**
     * 记分项的项目显示在此位置上时，项目排序的方式。
     */
    sortOrder?: ObjectiveSortOrder;
}

/**
 * 记分板。
 */
export class Scoreboard {
    /**
     * 存储记分项对象。
     * @type {Map<string, Objective>}
     */
    static #objectives: Map<string, Objective> = new Map();
    
    /**
     * 在记分板上添加新的记分项。
     * @param {string} name - 新的记分项的名称（标识符）。
     * @param {string} criteria - 记分项的准则，永远都应该是 `"dummy"`。
     * @param {string} [displayName] - 为新添加的记分项指定显示名称，
     * 若不指定则将 `name` 作为显示名称。
     * @returns {Objective} 添加的记分项的对象。
     * @throws 若准则不为 `"dummy"`，抛出错误。
     * @throws 若 `name` 指定的记分项已经存在，抛出错误。
     */
    static addObjective(name: string, criteria: "dummy" = "dummy", displayName: string = name): Objective {
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        else if (Scoreboard.tryGetObjective(name) !== false)
            throw new Error("Objective "+name+" existed!");
        else if (criteria !== "dummy")
            throw new Error("Unsupported criteria: " + criteria);
        else if (typeof name !== "string" || name.length === 0)
            throw new TypeError("Objective display name not valid!");
        
        let vanillaObjective = VanillaScoreboard.addObjective(name, displayName);
        
        let newObjective = new Objective(Scoreboard,
            name, criteria, displayName,
            { vanillaObjective }
        );
        Scoreboard.#objectives.set(name, newObjective);
        
        return newObjective;
    }
    
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，可以直接指定记分项的名称。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(objective: string|Objective|Minecraft.ScoreboardObjective): boolean {
        let objectiveId;
        if (objective instanceof Objective || objective instanceof Minecraft.ScoreboardObjective){
            objectiveId = objective.id;
        } else {
            objectiveId = objective;
        }
        if (typeof objectiveId === "string"){
            if (Scoreboard.#objectives.has(objectiveId)){
                Scoreboard.#objectives.delete(objectiveId);
            }
            try {
                return VanillaScoreboard.removeObjective(objectiveId);
            } catch {
                return false;
            }
        } else {
            return false;
            //throw new TypeError("could not determine what objective to remove");
        }
    }
    
    /**
     * 尝试获取名称为 `name` 的记分项对象。
     * @param {string} name - 记分项的 ID。
     * @returns {Objective} 名称为 `name` 的记分项，或者 `false`。
     */
    static tryGetObjective(name: string): Objective | false {
        let objective = Scoreboard.#objectives.get(name);
        if (objective?.vanillaObjective.isValid()){
            return objective;
        } else if (Scoreboard.#objectives.has(name)){
            Scoreboard.#objectives.delete(name);
        }
        let vanillaObjective: Minecraft.ScoreboardObjective | null = null;
        try {
            vanillaObjective = VanillaScoreboard.getObjective(name);
        } catch {
            return false;
        }
        if (vanillaObjective == null){
            return false;
        }
        objective = new Objective(Scoreboard,
            vanillaObjective.id,
            "dummy",
            vanillaObjective.displayName,
            { vanillaObjective }
        );
        Scoreboard.#objectives.set(name, objective);
        return objective;
    }

    /**
     * 获取记分项。
     * @param {string | Minecraft.ScoreboardObjective} objectiveId - 代表一个记分项的值，可以为它的 ID 或原版记分项对象。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns {Objective} `objectiveId` 所对应的的记分项。
     * @throws 若 `objectiveId` 为记分项ID，且未设置 `autoCreateDummy` 为 `true`，抛出 ReferenceError `记分项不存在`。
     * @throws 若 `objectiveId` 为原版记分项对象，且未设置 `autoCreateDummy` 为 `true` 或无法读取记分项信息，抛出 ReferenceError `尝试获取/读取无法使用的记分项对象`。
     */
    static getObjective(objectiveId: string | Minecraft.ScoreboardObjective, autoCreateDummy?: boolean): Objective {
        let objective: Objective | null | undefined = null;
        let name: string | null | undefined = null;
        
        if (objectiveId instanceof Minecraft.ScoreboardObjective){
            let vanillaObjective = objectiveId;
            if (vanillaObjective.isValid()){
                name = vanillaObjective.id;
            } else if (autoCreateDummy){
                try {
                    name = vanillaObjective.id;
                } catch {
                    throw new ReferenceError("attempt to create a removed objective");
                }
            } else {
                throw new ReferenceError("attempt to get a removed objective");
            }
        } else {
            name = objectiveId;
        }
        
        if (name){
            objective = Scoreboard.tryGetObjective(name) || null;

            if (!objective && autoCreateDummy){
                VanillaScoreboard.addObjective(name, name);
                objective = Scoreboard.tryGetObjective(name) as Objective;
            }
        }
        
        if (!objective)
            throw new ReferenceError("objective "+name+" didn't exist");
        
        return objective;
    }
    
    /** 
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives(): Objective[]{
        const objectives: Objective[] = [];
        for (const vanillaObjective of VanillaScoreboard.getObjectives()){
            objectives.push(Scoreboard.tryGetObjective(vanillaObjective.id) as Objective);
        }
        return objectives;
    }
    
    /**
     * 获得显示位上正在显示的内容的信息。
     * @param {DisplaySlot|Minecraft.DisplaySlotId} slot - 显示位。
     * @returns {DisplayOptions} - 显示位上显示的内容。
     */
    static getDisplayAtSlot(slot: DisplaySlot | Minecraft.DisplaySlotId): DisplayOptions{
        let rt = VanillaScoreboard.getObjectiveAtDisplaySlot(slot as Minecraft.DisplaySlotId);
        let result: DisplayOptions = {
            objective: rt.objective ?
                Scoreboard.getObjective(rt.objective.id) :
                null
        };
        if ("sortOrder" in rt){
            result.sortOrder = rt.sortOrder as unknown as ObjectiveSortOrder;
        }
        return result;
    }
    
    static #getIdOfObjective(any: Objective | Minecraft.ScoreboardObjective | string){
         if (any instanceof Objective || any instanceof Minecraft.ScoreboardObjective){
             return any.id;
         } else if (any && typeof any === "string"){
             return any;
         } else {
             throw new TypeError("unknown objective");
         }
    }
    
    /**
     * 设置显示位上显示的记分项，并允许额外的设置。
     * @param {DisplaySlot|Minecraft.DisplaySlotId} slot - 显示位。
     * @param {DisplayOptionsDefinition} settings - 显示位的设置。
     * @returns {Objective} 显示位先前显示的记分项的对象，若先前未显示任何记分项，返回 `undefined` 。
     */
    static setDisplayAtSlot(slot: DisplaySlot|Minecraft.DisplaySlotId, settings: DisplayOptionsDefinition){
        let objective = Scoreboard.getObjective(Scoreboard.#getIdOfObjective(settings?.objective));
        
        if (objective == null){
            throw new Error("Unknown objective in settings");
        }
        
        let settingArg: Minecraft.ScoreboardObjectiveDisplayOptions;
        try { //兼容旧版
            if ("sortOrder" in settings){
                // @ts-ignore 旧版兼容，忽略类型不存在的问题。
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    objective.vanillaObjective,
                    settings.sortOrder
                );
            } else {
                // @ts-ignore 旧版兼容，忽略类型不存在的问题。
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    objective.vanillaObjective
                );
            }
        } catch { //新版本修改为接口
            settingArg = {
                objective: objective.vanillaObjective
            };
            if ("sortOrder" in settings){
                settingArg.sortOrder = settings.sortOrder === "ascending"
                    ? Minecraft.ObjectiveSortOrder.Ascending
                    : Minecraft.ObjectiveSortOrder.Descending;
            }
        }
        let lastDisplayingObjective = VanillaScoreboard.setObjectiveAtDisplaySlot(
            slot as Minecraft.DisplaySlotId,
            settingArg
        );
        if (lastDisplayingObjective == undefined)
            return undefined;
        return Scoreboard.getObjective(lastDisplayingObjective.id);
    }
    
    /**
     * 清空显示位上正显示的记分项。
     * @param {DisplaySlot|Minecraft.DisplaySlotId} slot - 显示位。
     * @returns {Objective} 显示位先前显示的记分项，若无，返回 `null` 。
     */
    static clearDisplaySlot(slot: DisplaySlot|Minecraft.DisplaySlotId): Objective | null{
        let rt = VanillaScoreboard.clearObjectiveAtDisplaySlot(slot as Minecraft.DisplaySlotId);
        if (rt?.id != null){
            return Scoreboard.getObjective(rt.id);
        } else {
            return null;
        }
    }
    
    /**
     * 获取记分板上记录的所有分数持有者。
     * @returns {ScoreboardEntry[]}
     */
    static getEntries(): ScoreboardEntry[]{
        const entries: ScoreboardEntry[] = [];
        for (const identify of VanillaScoreboard.getParticipants()){
            const entry = ScoreboardEntry.getEntry(identify.type as unknown as EntryType, identify);
            entries.push(entry);
        }
        return entries;
    }
    
    /**
     * 移除记分板的所有记分项。
     */
    static removeAllObjectives(){
        for (const objective of VanillaScoreboard.getObjectives()){
            Scoreboard.removeObjective(objective);
        }
    }
    
    /**
     * 重置记分板上所有分数持有者的所有分数记录。
     */
    static resetAllScores(){
        for (const objective of VanillaScoreboard.getObjectives()){
            for (const scbid of objective.getParticipants()){
                objective.removeParticipant(scbid);
            }
        }
    }

    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @param {EntryValueType} one - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static resetScore(one: EntryValueType){
        let identify = ScoreboardEntry.guessEntry(one).getIdentity();
        
        for (const objective of VanillaScoreboard.getObjectives()){
            if (objective.hasParticipant(identify)){
                objective.removeParticipant(identify);
            }
        }
    }
}
