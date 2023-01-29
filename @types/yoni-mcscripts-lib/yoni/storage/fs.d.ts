/**
 * @enum {O_X}
 */
declare const O_X: {
    O_RDONLY: symbol;
    O_WRONLY: symbol;
    O_RDWR: symbol;
    O_APPEND: symbol;
    O_CREAT: symbol;
    O_EXCL: symbol;
    O_TRUNC: symbol;
    O_TEXT: symbol;
};
declare const S_X: {
    SEEK_SET: symbol;
    SEEK_CUR: symbol;
    SEEK_END: symbol;
};
/**
 * @typedef {number} filehandler - 大于等于0的数字
 */
/**
 * 操作文件系统的各类方法
 */
declare class fs {
    /**
     * @param {string} filename
     * @param {O_X} flags
     * @param {number} mode
     * @returns {filehandler|number}
     */
    open(filename: any, flags: any, mode?: number): void;
    /**
     * @param {filehandler} fd
     */
    close(fd: any): void;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} current location
     */
    seek(fd: any, offset: any, whence: any): void;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} read bytes or < 0 if error
     */
    read(): void;
    write(): void;
    isatty(): boolean;
    ttyGetWinSize(): null;
    ttySetRaw(): number;
    remove(): void;
}
