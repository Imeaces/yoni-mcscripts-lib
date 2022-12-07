/**
 * 得到一个对象上的所有键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为Object.prototype，即从Object原型方法上断开继承
 */
export function getKeys(object: any, endPrototype?: any, ...args: any[]): any[];
export function dealWithCmd(key: any, value: any): any;
