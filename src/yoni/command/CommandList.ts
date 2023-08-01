import { CommandPriority } from "./CommandPriority.js";

export class CommandList<T> {
    #commands: T[][] = [[], [], [], [], []];
    #indexes: number[] = [0, 0, 0, 0, 0];
    #count: number[] = [0, 0, 0, 0, 0];
    hasNext(): boolean {
        for (const prio of [0, 1, 2, 3, 4]){
            if (this.#count[prio] > 0)
                return true;
        }
        return false;
    }
    next(): T {
        let nextCommand: T | null = null;
        
        for (const prioIndex of [0, 1, 2, 3, 4]){
            if (this.#count[prioIndex] > 0){
                const index = this.#indexes[prioIndex];
                nextCommand = this.#commands[prioIndex][index];
                this.#indexes[prioIndex] += 1;
                this.#count[prioIndex] -= 1;
                break;
            }
        }
        
        if (!nextCommand)
            throw new Error("no next command");
            
        return nextCommand;
    }
    add(prio: CommandPriority, command: T){
        const prioIndex = (prio as any) - 1;
        this.#commands[prioIndex].push(command);
        this.#count[prioIndex] += 1;
    }
    count(): number {
        return this.#count.reduce((a, b) => a + b);
    }
}