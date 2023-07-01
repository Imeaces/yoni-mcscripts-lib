export type EventCallback = (event: Event) => void;
export type EventCallbacks = EventCallback[];

/**
 * @deprecated 废弃，等待重写
 */
export class Event {
    constructor(...values: any[]) {
        Object.assign(this, ...values);
    }
}
export default Event;
