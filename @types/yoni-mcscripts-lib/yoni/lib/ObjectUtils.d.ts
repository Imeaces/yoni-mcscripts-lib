declare function copyPropertiesWithoutOverride(target: {}, src: {}, accessKey: string | symbol): {};
declare function assignAllPropertiesWithoutOverride(target: {}, ...srcs: {}[]): {};
/**
 * 得到一个对象上的所有键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为Object.prototype，即从Object原型方法上断开继承
 */
declare function getKeys(object: any, endPrototype?: {} | null): string[];
/**
 * 得到一个对象上的所有属性键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为`Object.prototype`，即从Object原型方法上断开继承
 */
declare function getProperties(object: {}, endPrototype?: {} | null): (string | symbol)[];
declare function getOwnProperties(object: {}): (string | symbol)[];
declare function getOwnKeys(object: {}): (string | symbol)[];
declare function listNotExistingKeys(base: {}, compare: {}): string[];
declare const ObjectUtils: {
    copyPropertiesWithoutOverride: typeof copyPropertiesWithoutOverride;
    assignAllPropertiesWithoutOverride: typeof assignAllPropertiesWithoutOverride;
    getKeys: typeof getKeys;
    getProperties: typeof getProperties;
    getOwnKeys: typeof getOwnKeys;
    getOwnProperties: typeof getOwnProperties;
    listNotExistingKeys: typeof listNotExistingKeys;
};
export { copyPropertiesWithoutOverride, assignAllPropertiesWithoutOverride, getKeys, getProperties, getOwnKeys, getOwnProperties, listNotExistingKeys, ObjectUtils, };
