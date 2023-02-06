/**
 * @param {()=>void} func
 * @param {number} delay
 * @param {...any} [args]
 * @returns {number} timeoutId
 */
export function setTimeout(func: () => void, delay?: number, ...args?: any[] | undefined): number;
/**
 * @param {number} timeoutId
 */
export function clearTimeout(timeoutId: number): void;
/**
 * @param {()=>void} func
 * @param {number} delay
 * @param {...any} [args]
 * @returns {number} intervalId
 */
export function setInterval(func: () => void, delay?: number, ...args?: any[] | undefined): number;
/**
 * @param {number} intervalId
 */
export function clearInterval(intervalId: number): void;
