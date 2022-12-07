export function getIdentifierInfo(identifier: any): {
    id: string;
    name: string;
    namespace: string | null;
};
export default Types;
export class Types {
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
    static getAll: () => Generator<any, void, unknown>;
}
export class EventRegisterListener {
    static add(eventTypeIdentifier: any, callback: any): void;
    static register(eventType: any): Promise<void>;
}
export { Types as EventTypes };
