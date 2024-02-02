export interface AsyncCommandSender {
    runCommandAsync(command: string): Promise<any>;
}

