declare function copyPropertiesWithoutOverride(target: any, src: any, accessKey: any): void;
declare function assignAllPropertiesWithoutOverride(target: any, ...srcs: any[]): void;
/**
 * 得到一个对象上的所有键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为Object.prototype，即从Object原型方法上断开继承
 */
declare function getKeys(object: any, endPrototype: any): unknown[];
/**
 * 得到一个对象上的所有属性键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为`Object.prototype`，即从Object原型方法上断开继承
 */
declare function getProperties(object: any, endPrototype: any): unknown[];
declare function getOwnProperties(object: any): unknown[];
declare function getOwnKeys(object: any): unknown[];
declare const ObjectUtils: {
    copyPropertiesWithoutOverride: typeof copyPropertiesWithoutOverride;
    assignAllPropertiesWithoutOverride: typeof assignAllPropertiesWithoutOverride;
    getKeys: typeof getKeys;
    getProperties: typeof getProperties;
    getOwnKeys: typeof getOwnKeys;
    getOwnProperties: typeof getOwnProperties;
};
export { copyPropertiesWithoutOverride, assignAllPropertiesWithoutOverride, getKeys, getProperties, getOwnKeys, getOwnProperties, ObjectUtils, };
