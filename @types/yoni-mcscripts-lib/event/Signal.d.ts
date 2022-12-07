export default Signal;
export class Signal {
    constructor(identifier: any, trigger: any);
    get identifier(): string | undefined;
    get namespace(): string | null;
    get eventName(): string;
    subscribe(callback: any, ...filters: any[]): void;
    unsubscribe(callback: any): void;
    #private;
}
export { Signal as EventSignal };
