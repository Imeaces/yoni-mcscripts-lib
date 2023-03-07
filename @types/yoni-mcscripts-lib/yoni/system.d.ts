declare class System {
    run(callback: (...args: any[]) => void, ...args: any[]): void;
    get events(): import("@minecraft/server").SystemEvents;
    get currentTick(): number;
    setInterval(callback: () => void, interval: number): number;
    setTimeout(callback: () => void, timeout?: number): number;
    setIntervalTick(callback: () => void, intervalTick: number): number;
    setTimeoutTick(callback: () => void, timeoutTick: number): number;
    clearInterval(id: number): boolean;
    clearTimeout(id: number): boolean;
    clearIntervalTick(id: number): boolean;
    clearTimeoutTick(id: number): boolean;
}
declare const system: System;
export { system };
export default system;
