import { isDebug } from "./config.js";

export async function setDebugFunction(fn: (...args: any[]) => void, ...args: Parameters<typeof fn>){
  if (isDebug())
     fn(...args);
}

export async function runTaskIfDebug(callback: () => void){
    setDebugFunction(callback);
}

export { isDebug };

setDebugFunction(() => import("./debug_func.js"));
