/**
 * @param {()=>void} func
 * @param {number} delay
 * @param {...any} [args]
 * @returns {number} timeoutId
 */
export declare function setTimeout(func: any, delay?: number, ...args: any[]): number;
/**
 * @param {number} timeoutId
 */
export declare function clearTimeout(timeoutId: any): void;
/**
 * @param {()=>void} func
 * @param {number} delay
 * @param {...any} [args]
 * @returns {number} intervalId
 */
export declare function setInterval(func: any, delay?: number, ...args: any[]): number;
/**
 * @param {number} intervalId
 */
export declare function clearInterval(intervalId: any): void;
