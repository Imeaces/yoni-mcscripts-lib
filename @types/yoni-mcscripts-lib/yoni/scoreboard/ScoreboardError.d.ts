/**
 * 错误：值不能作为分数。
 */
export declare class ScoreRangeError extends RangeError {
    name: string;
    message: string;
}
/**
 * 错误：记分项已从记分板上移除。
 */
export declare class ObjectiveUnregisteredError extends Error {
    name: string;
    constructor(name: any);
}
/**
 * 错误：虚拟玩家名称与游戏中正在游玩的玩家拥有相同的名字，无法为虚拟玩家设置分数。
 */
export declare class NameConflictError extends Error {
    name: string;
    constructor(name: any);
}
/**
 * 错误：无法从可能的记分持有者的值得到记分持有者对象。
 */
export declare class UnknownEntryError extends ReferenceError {
    name: string;
    message: string;
}
