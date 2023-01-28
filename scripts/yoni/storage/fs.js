"use strict";
// @ts-nocheck
/**
 * @enum {O_X}
 */
const O_X = {
    O_RDONLY: Symbol(),
    O_WRONLY: Symbol(),
    O_RDWR: Symbol(),
    O_APPEND: Symbol(),
    O_CREAT: Symbol(),
    O_EXCL: Symbol(),
    O_TRUNC: Symbol(),
    O_TEXT: Symbol(), //windows specific
};
const S_X = {
    SEEK_SET: Symbol(0),
    SEEK_CUR: Symbol(1),
    SEEK_END: Symbol(2), //从文件末尾
};
/**
 * @typedef {number} filehandler - 大于等于0的数字
 */
/**
 * 操作文件系统的各类方法
 */
class fs {
    /**
     * @param {string} filename
     * @param {O_X} flags
     * @param {number} mode
     * @returns {filehandler|number}
     */
    open(filename, flags, mode = 0o666) { }
    /**
     * @param {filehandler} fd
     */
    close(fd) { }
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} current location
     */
    seek(fd, offset, whence) { }
    /**
     * @param {filehandler} fd
     * @param {number} offset
     * @param {S_X} whence
     * @returns {number} read bytes or < 0 if error
     */
    read() { }
    write() { }
    isatty() {
        return false;
    }
    ttyGetWinSize() {
        return null;
    }
    ttySetRaw() {
        return 255;
    }
    remove() { }
}
