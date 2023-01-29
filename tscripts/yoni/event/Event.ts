export type EventCallback = (event: Event) => void;
export type EventCallbacks = EventCallback[];


export class Event {
    constructor(...values) {
        Object.assign(this, ...values);
    }
}
export default Event;
