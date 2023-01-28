export default class ChatCommand {
    #private;
    static get defaultPrefix(): string;
    static set defaultPrefix(i: string);
    static receiveBeforeChatEvent(event: any): void;
    static registerPrefixCommand(...args: any[]): void;
    /**
     *
     * @param {string} command
     * @param {(sender:YoniEntity, rawCommand:string, label:string, args:string[])=>void} executor
     */
    static registerCommand(command: any, executor: any): void;
    static unregisterCommand(command: any): void;
    static registerNonPrefixCommand(command: any, executor: any): void;
    static unregisterNonPrefixCommand(command: any): void;
    static registerCustomPrefixCommand(prefix: any, command: any, executor: any): void;
    static unregisterCustomPrefixCommand(prefix: any, command: any): void;
    static getParameters(commandContent: any): never[];
}
export { ChatCommand };
