declare class StorageAdapter {
    static "__#33@#save"(name: any, copyOfLokiDb: any): Promise<void>;
    mode: string;
    exportDatabase(dbname: any, getCopy: any, callback: any): Promise<void>;
    loadDatabase(dbname: any, callback: any): void;
}