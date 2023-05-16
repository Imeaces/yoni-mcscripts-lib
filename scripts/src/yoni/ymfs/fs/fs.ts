export enum O_X {
    /** 只读 */
    O_RDONLY = 1,
    /** 只写 */
    O_WRONLY = 2,
    /** 读写 */
    O_RDWR = 3,
    /** 追加（读写情况不知） */
    O_APPEND = 4,
    /** 创建 */
    O_CREAT = 5,
    /** 存在时报错 */
    O_EXCL = 6,
    /** 打开，并截断长度为0（重写） */
    O_TRUNC = 7,
    /** Windows specific */
    O_TEXT = 8,
}
export enum S_X {
    /** 从文件开头 */
    SEEK_SET = 0,
    /** 从当前指针位置 */
    SEEK_CUR = 1,
    /** 从文件末尾 */
    SEEK_END = 2,
}

export type filehandler = number;

/**
 * 操作文件系统的各类方法
 */
export interface fs {
    /**
     * @param {string} filename
     * @param {O_X} flags
     * @param {number} mode
     * @returns {filehandler}
     */
    open(filename: string, flags: O_X, mode: number): filehandler;
    /**
     * @param {filehandler} fd
     */
    close(fd: filehandler): boolean;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} current location
     */
    seek(fd: filehandler, offset: number, whence: S_X): number;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} read bytes or < 0 if error
     */
    read(pos: number, len: number, buffer?: ArrayBuffer): ArrayBuffer;
    write(data: ArrayBuffer, pos: number, len: number): void;
    isatty(fd: filehandler): boolean;
    ttyGetWinSize(): number | null;
    ttySetRaw(): number;
    remove(): boolean;
    
}
