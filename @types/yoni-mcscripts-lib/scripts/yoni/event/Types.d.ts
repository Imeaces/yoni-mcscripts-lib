export declare function getIdentifierInfo(identifier: any): {
    id: string;
    name: null;
    namespace: null;
};
declare class EventRegisterListener {
    static add(eventTypeIdentifier: any, callback: any): void;
    static register(eventType: any): Promise<void>;
}
declare class Types {
    static register(identifier: any, eventType: any): void;
    static registerNamespace(namespace: any, namespaceEventTypes: any): void;
    /**
     * @param {String} 事件的identifer
     * @returns {Boolean} 事件是否存在且已移除
     */
    static unregister(identifier: any): boolean;
    static hasNamespace(namespace: any): boolean;
    static has(identifier: any): any;
    /**
     * @param {String} 事件的identifer
     * @returns 事件的示例，如不存在返回null
     */
    static get(identifier: any): any;
    static getEventTypes(): Map<any, any>;
    static getAll(): Generator<any, void, any>;
}
export declare const events: {};
export default Types;
export { Types };
export { Types as EventTypes };
export { EventRegisterListener };
