import { EventListenerData, sEventListenerData } from "../decorators/EventListener.js";

export default interface EventListener<T> {
    [sEventListenerData]: EventListenerData<T>
}