export default UUID;
export class UUID {
    static NIL_UUID_STR: string;
    static NIL_UUID: null;
    static UUID_CHARS: string[];
    static randomUUID(): UUID;
    static fromInt(int: any): void;
    static fromUUID(u: any): UUID;
    static clone(u: any): UUID;
    constructor(targetUUID: any, allowNil?: boolean);
    get uuidSequene(): any[];
    toJSON(): string;
    clone(): UUID;
    toString(): string;
    toLocaleString(): string;
    #private;
}
