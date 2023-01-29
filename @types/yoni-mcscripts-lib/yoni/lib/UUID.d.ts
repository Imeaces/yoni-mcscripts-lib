declare class UUID {
    #private;
    static NIL_UUID_STR: string;
    static NIL_UUID: null;
    static UUID_CHARS: string[];
    static randomUUID(): UUID;
    static fromInt(int: any): void;
    static fromUUID(u: any): UUID;
    static clone(u: any): UUID;
    get uuidSequene(): never[];
    toJSON(): string;
    clone(): UUID;
    toString(): string;
    toLocaleString(): string;
    constructor(targetUUID: any, allowNil?: boolean);
}
export default UUID;
export { UUID };
