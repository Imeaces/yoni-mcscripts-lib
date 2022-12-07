export class PlayerEvent {
    constructor(player: any, ...args: any[]);
    get player(): any;
    eventType: any;
    #private;
}
export default PlayerEvent;
