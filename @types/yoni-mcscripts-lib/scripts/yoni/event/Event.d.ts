export declare type EventCallback = (event: Event) => void;
export declare type EventCallbacks = EventCallback[];
export declare class Event {
    constructor(...values: any[]);
}
export default Event;
