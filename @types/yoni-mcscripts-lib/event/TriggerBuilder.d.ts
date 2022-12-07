export default TriggerBuilder;
export class TriggerBuilder {
    constructor(identifier: any);
    id(identifier: any): TriggerBuilder;
    identifier(): TriggerBuilder;
    namespace(): TriggerBuilder;
    eventSignalClass(n: any): TriggerBuilder;
    eventClass(n: any): TriggerBuilder;
    filterResolver(n: any): TriggerBuilder;
    firebug(n: any): TriggerBuilder;
    firebugAsync(n: any): TriggerBuilder;
    onSubscribe(n: any): TriggerBuilder;
    onUnsubscribe(n: any): TriggerBuilder;
    whenFirstSubscribe(n: any): TriggerBuilder;
    onFirstSubscribe: (n: any) => TriggerBuilder;
    whenLastUnsubscribe(n: any): TriggerBuilder;
    onLastUnsubscribe: any;
    build(): EventTrigger;
    #private;
}
import { EventTrigger } from "./Trigger.js";
export { TriggerBuilder as EventTriggerBuilder };
