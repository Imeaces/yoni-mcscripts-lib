import { CommandPriority } from "./CommandPriority.js";

export class CommandList<T> {
    #commands: T[][] = [[], [], [], [], []];
    #indexes: number[] = [0, 0, 0, 0, 0];
    #count: number[] = [0, 0, 0, 0, 0];
    hasNext(): boolean {
        for (const priv of [0, 1, 2, 3, 4]){
            if (this.#count[priv] > 0)
                return true;
        }
        return false;
    }
    next(): T {
        let nextCommand: T | null = null;
        
        for (const privIndex of [0, 1, 2, 3, 4]){
            if (this.#count[privIndex] > 0){
                const index = this.#indexes[privIndex];
                nextCommand = this.#commands[privIndex][index];
                this.#indexes[privIndex] += 1;
                this.#count[privIndex] -= 1;
                break;
            }
        }
        
        if (!nextCommand)
            throw new Error("no next command");
            
        return nextCommand;
    }
    add(priv: CommandPriority, command: T){
        const privIndex = (priv as any) - 1;
        this.#commands[privIndex].push(command);
        this.#count[privIndex] += 1;
    }
    count(): number {
        return this.#count.reduce((a, b) => a + b);
    }
}