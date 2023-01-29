declare class StorageAdapter {
    #private;
    mode: string;
    constructor();
    exportDatabase(dbname: any, getCopy: any, callback: any): Promise<void>;
    loadDatabase(dbname: any, callback: any): void;
}
