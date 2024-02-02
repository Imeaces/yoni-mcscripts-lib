export type EventCallback = (event: Event) => void;
export type EventCallbacks = EventCallback[];

/**
 * @deprecated 废弃，不再使用。另外，如果你使用了此LegacyEvent中的自定义事件，webpack打包或者类似的操作将无法完成。
 */
export class Event {
    constructor(...values: any[]) {
        Object.assign(this, ...values);
    }
}
