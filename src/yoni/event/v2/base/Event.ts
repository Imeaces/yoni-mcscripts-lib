export abstract class Event {
    [Symbol.hasInstance](value: any){
        return true;
    }
}