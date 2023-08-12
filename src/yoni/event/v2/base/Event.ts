export abstract class Event {
    [Symbol.hasInstance](value: any){
        return value?.constructor?.name?.endsWith("Event");
    }
}