import { EventTrigger } from "./Trigger.js";
declare class TriggerBuilder {
    #private;
    constructor(identifier?: any);
    id(identifier: any): this;
    identifier(): this;
    namespace(): this;
    eventSignalClass(n: any): this;
    eventClass(n: any): this;
    filterResolver(n: any): this;
    firebug(n: any): this;
    firebugAsync(n: any): this;
    onSubscribe(n: any): this;
    onUnsubscribe(n: any): this;
    whenFirstSubscribe(n: any): this;
    get onFirstSubscribe(): void;
    whenLastUnsubscribe(n: any): this;
    get onLastUnsubscribe(): void;
    build(): EventTrigger;
}
export default TriggerBuilder;
export { TriggerBuilder };
export { TriggerBuilder as EventTriggerBuilder };
