type O_X = O_X;
declare namespace O_X {
    const O_RDONLY: symbol;
    const O_WRONLY: symbol;
    const O_RDWR: symbol;
    const O_APPEND: symbol;
    const O_CREAT: symbol;
    const O_EXCL: symbol;
    const O_TRUNC: symbol;
    const O_TEXT: symbol;
}
declare namespace S_X {
    const SEEK_SET: symbol;
    const SEEK_CUR: symbol;
    const SEEK_END: symbol;
}
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
    open(filename: string, flags: any, mode?: number): filehandler | number;
    /**
     * @param {filehandler} fd
     */
    close(fd: filehandler): void;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} current location
     */
    seek(fd: filehandler, offset: number, whence: {
        SEEK_SET: symbol;
        SEEK_CUR: symbol;
        SEEK_END: symbol;
    }): number;
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} read bytes or < 0 if error
     */
    read(): number;
    write(): void;
    isatty(): boolean;
    ttyGetWinSize(): null;
    ttySetRaw(): number;
    remove(): void;
}
/**
 * - 大于等于0的数字
 */
type filehandler = number;
