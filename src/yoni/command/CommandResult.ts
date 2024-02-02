import { StatusCode } from "../basis.js";
/**
 * 表示命令完成执行后返回的结果。
 */
export interface CommandResult {
    statusCode: StatusCode;
    successCount: number;
    statusMessage?: string;
}
