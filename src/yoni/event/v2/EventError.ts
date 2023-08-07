import { EventRegistry } from "./EventRegistry.js";

export class EventError<T extends EventRegistry<TEvent>, TEvent extends Function = T["eventClass"], E extends {} = TEvent["prototype"]> extends Error {
    constructor(registry: T, event: E, error: any){
        super("处理事件时遇到了错误：" + error.message);
        this.name = "EventError";
        this.cause = error;
    }
    cause: any
}