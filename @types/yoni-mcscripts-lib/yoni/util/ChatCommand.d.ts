export default class ChatCommand {
    static set defaultPrefix(arg: string);
    static get defaultPrefix(): string;
    static receiveBeforeChatEvent(event: any): void;
    static registerPrefixCommand(...args: any[]): void;
    /**
     *
     * @param {string} command
     * @param {(sender: YoniPlayer, rawCommand:string, label:string, args:string[])=>void} executor
     */
    static registerCommand(command: string, executor: (sender: YoniPlayer, rawCommand: string, label: string, args: string[]) => void): void;
    static unregisterCommand(command: any): void;
    static registerNonPrefixCommand(command: any, executor: any): void;
    static unregisterNonPrefixCommand(command: any): void;
    static registerCustomPrefixCommand(prefix: any, command: any, executor: any): void;
    static unregisterCustomPrefixCommand(prefix: any, command: any): void;
    static "__#7@#invokeCommand"(options: any): void;
    static getParameters(commandContent: any): string[];
}
import { YoniPlayer } from "../entity.js";
