export function Listerer(event, callback, ...args){
    event.subscribe(callback, ...args);
}