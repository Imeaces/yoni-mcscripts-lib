import { StatusCode, VanillaScoreboard, Minecraft, VanillaWorld } from "../basis.js";
import { Command } from "../command.js";

import {
    NameConflictError,
    // ScoreRangeError,
    // ObjectiveUnregisteredError,
    // UnknownEntryError,
} from "./ScoreboardError.js"
import { Objective } from "./Objective.js";
import { Entry, EntryType } from "./Entry.js";
import { EntryValueType } from "./EntryType.js";

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
    static addObjective(name: string, criteria: string = "dummy", displayName: string = name): Objective {
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        if (Scoreboard.getObjective(name) !== null)
            throw new Error("Objective "+name+" existed!");
        if (criteria !== "dummy")
            throw new Error("Unsupported criteria: " + criteria);
        if (typeof name !== "string" || name.length === 0)
            throw new TypeError("Objective display name not valid!");
        
        let vanillaObjective = VanillaScoreboard.addObjective(name, displayName);
        
        let newObjective = new Objective({
            scoreboard: Scoreboard,
            name, criteria, displayName,
            vanillaObjective
        });
        Scoreboard.#objectives.set(name, newObjective);
        
        return newObjective;
    }
    
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，可以直接指定记分项的名称。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(nameOrObjective: string|Objective|Minecraft.ScoreboardObjective): boolean {
        let objectiveId;
        if (nameOrObjective instanceof Objective || nameOrObjective instanceof Minecraft.ScoreboardObjective){
            objectiveId = nameOrObjective.id;
        } else {
            objectiveId = nameOrObjective;
        }
        if (objectiveId && typeof objectiveId === "string"){
            if (Scoreboard.#objectives.has(objectiveId)){
                Scoreboard.#objectives.delete(objectiveId);
            }
            try {
                return VanillaScoreboard.removeObjective(objectiveId);
            } catch {
                return false;
            }
        } else {
            throw new TypeError("unknown error while removing objective");
        }
    }
    
    /**
     * 获取名称为 `name` 的记分项对象。
     * @param {string|Minecraft.ScoreboardObjective} name - 可以代表记分项的值。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns {Objective} 名称为 `name` 的记分项。
     * 若不存在名称为 `name` 的记分项，且未设置 `autoCreateDummy` 为 `true`，返回 `null`。
     * 若不存在名称为 `name` 的记分项，且设置了 `autoCreateDummy` 为 `true`，创建名称为 `name` 的记分项，并返回其对象。
     */
    static getObjective(name: string | Minecraft.ScoreboardObjective, autoCreateDummy: true): Objective;
    static getObjective(name: string | Minecraft.ScoreboardObjective, autoCreateDummy: false): Objective | null;
    static getObjective(name: string | Minecraft.ScoreboardObjective): Objective | null;
    static getObjective(name: string|Minecraft.ScoreboardObjective, autoCreateDummy: boolean = false ): Objective | null {
        let vanillaObjective: Minecraft.ScoreboardObjective | undefined = undefined;
        let result: Objective | null = null;
        
        if (name instanceof Minecraft.ScoreboardObjective){
            if (name.isValid()){
                vanillaObjective = name;
            } else {
                try {
                    vanillaObjective = VanillaScoreboard.getObjective(name.id);
                } catch {
                }
                if (vanillaObjective == null)
                    throw new ReferenceError("attempt to get an removed objective");
            }
            name = vanillaObjective.id;
        } else if (typeof name === "string"){
            vanillaObjective = VanillaScoreboard.getObjective(name);
        }
        if (vanillaObjective == null && autoCreateDummy){
            vanillaObjective = VanillaScoreboard.addObjective(name, name);
        }
        
        if (vanillaObjective != null){
            let record = Scoreboard.#objectives.get(name);
            if (record === undefined || record.vanillaObjective !== vanillaObjective){
                record = new Objective(Scoreboard, name, "dummy", vanillaObjective.displayName, vanillaObjective);
                Scoreboard.#objectives.set(name, record);
            }
            result = record;
        }
        return result;
    }
    
    /** 
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives(): Objective[]{
        return Array.from(VanillaScoreboard.getObjectives())
            .map(obj => Scoreboard.getObjective(obj.id) as Objective);
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
     * @returns {Entry[]}
     */
    static getEntries(): Entry[]{
        let arr = VanillaScoreboard.getParticipants();
        if (!Array.isArray(arr)){
            arr = Array.from(arr);
        }
        return arr.map(scbid => Entry.findEntry({ scbid, type: scbid.type }));
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
        let entry: Entry;
        if (one instanceof Entry)
            entry = one;
        else
            entry = Entry.guessEntry(one);
        
        let oneValue;
        
        if (entry.vanillaScbid){
            oneValue = entry.vanillaScbid;
        } else if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            oneValue = entry.getVanillaEntity();
            if (oneValue == null){
                throw new Error("Could not find the entity");
            }
        } else {
            oneValue = entry.displayName;
        }
        
        for (const objective of VanillaScoreboard.getObjectives()){
            if (objective.hasParticipant(oneValue)){
                objective.removeParticipant(oneValue);
            }
        }
    }

    /**
     * 以异步方式重置分数持有者的分数。
     * @deprecated 不再推荐使用，建议使用{@link Scoreboard.getEntries}并过滤特定条目后
     使用{@link Scoreboard.resetScore}移除，或使用{@link Scoreboard.resetAllScores}。
     * @param {(entry: Entry) => boolean} [filter] - 可选的过滤器函数，
     * 将所有分数持有者的 `Entry` 对象依次传入，若得到 `true` ，则重置
     * 此分数持有者的分数，否则将不会重置。
     * @returns {Promise<number>} 重置了多少分数持有者的分数。
     */
    static async postResetAllScores(filter?: (entry: Entry) => boolean): Promise<number>{
        if (arguments.length === 0){
            let rt = await Command.add(Command.PRIORITY_HIGHEST, "scoreboard players reset *");
            if (rt.statusCode !== StatusCode.success){
                throw new Error(rt.statusMessage);
            } else {
                return rt.successCount as unknown as number;
            }
        }
        let resolve: (v?: any) => void;
        let promise = new Promise((re)=>{
            resolve = re;
        });
        let entries = Scoreboard.getEntries();
        let successCount = 0;
        let doneCount = 0;
        let successCountAdder = ()=>{
            successCount++;
        };
        let resolveIfDone = ()=>{
            if (++doneCount === entries.length){
                resolve(successCount);
            }
        };
        // @ts-ignore 能用，忽略类型问题。
        entries.filter(filter).forEach((id)=>{
            Scoreboard.postResetScore(id)
                .then(successCountAdder)
                .finally(resolveIfDone);
        });
        return promise as Promise<number>;
    }
    
    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @deprecated 建议使用其同步版本 {@link Scoreboard.resetScore}
     * @param {EntryValueType} one - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static async postResetScore(one: EntryValueType){
        let entry: Entry;
        if (one instanceof Entry)
            entry = one;
        else
            entry = Entry.guessEntry(one);
            
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let ent = entry.getEntity();
            if (ent == null){
                throw new Error("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, "scoreboard", "players", "reset", "@s");
            if (rt.statusCode != StatusCode.success){
                throw new Error("Could not set score, maybe entity or player disappeared?");
            }
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let rt = await Command.add(Command.PRIORITY_HIGHEST,
                Command.getCommandMoreStrict("scoreboard", "players", "reset", entry.displayName));
            if (rt.statusCode !== StatusCode.success){
                throw new Error(rt.statusMessage);
            }
        } else {
            throw new NameConflictError(entry.displayName);
        }
    }
}
