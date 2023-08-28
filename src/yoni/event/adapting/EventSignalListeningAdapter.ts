import EventListeningAdapter from "../interfaces/EventListeningAdapter";
import TypedEventSignal from "../interfaces/TypedEventSignal";

export class EventSignalListeningAdapter<TEvent extends Function, E extends {} = TEvent["prototype"]> implements EventListeningAdapter<TEvent> {
    constructor(eventSignal: TypedEventSignal<E>){
        this.signal = eventSignal;
    }
    signal: TypedEventSignal<E>
    handler?: (event: E) => void
    listen(cb: (event: E) => void){
        this.handler = cb;
        this.signal.subscribe(this.handler);
    }
    remove(): boolean {
        if (this.handler){
            this.signal.unsubscribe(this.handler as (event: E) => void);
            return true;
        } 
        return false;
    }
}