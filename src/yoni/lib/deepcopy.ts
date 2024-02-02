//@ts-nocheck

interface DeepCopyOption {
    newObjectMaker(): {};
    dealCircular: "ignore" | "error";
    copyFunction: CopyFunction;
    rootObject: {}
}
interface CopyFunction {
    getCopiedValue(value: any): any;
    /**
     * 返回 `value` 是否可以复制。
     *
     * 注意：为原始值返回 `false` 会出现错误。
     */
    isCopyableValue(value: any): boolean;
}

const DEFAULT_OPTIONS: DeepCopyOption = {
    rootObject: undefined,
    newObjectMaker: () => ({}),
    dealCircular: ["ignore", "error"][1],
    copyFunction: {
        getCopiedValue,
        isCopyableValue,
    }
};
    
export function deepcopy(value: {}, option: Partial<DeepCopyOption> = {}){
    let applyOption = Object.assign({}, DEFAULT_OPTIONS, option);
    
    const { newObjectMaker, dealCircular } = applyOption;
    const { getCopiedValue, isCopyableValue } = applyOption.copyFunction;

    let rootnvalue = applyOption.rootObject ?? newObjectMaker();
    let nvalue = rootnvalue;
    let toCopyObjects = new Map();
    let referenceChainRecord = new WeakMap();

    for (;;){
        let referenceRecord = referenceChainRecord.get(nvalue) ?? [];
        let skipCopy = false;
        if (referenceRecord.includes(value)){
            if (dealCircular === "error")
                throw new Error("circular reference");
            else
                skipCopy = true;
        }
        referenceRecord.push(value);

        if (!skipCopy)
        for (const key in value){
            let subvalue = value[key];
            if (isCopyableValue(subvalue)){
                nvalue[key] = getCopiedValue(subvalue);
            } else {
                let subobject = newObjectMaker();
                referenceChainRecord.set(subobject, referenceRecord.slice(0));
                nvalue[key] = subobject;
                toCopyObjects.set(subobject, subvalue);
            }
        }

        if (toCopyObjects.size === 0)
            break;

        nvalue = toCopyObjects.keys().next().value;
        value = toCopyObjects.get(nvalue);
        toCopyObjects.delete(nvalue);

    }

    return rootnvalue;
}

export function isCopyableValue(value: any){
    switch (typeof value){
        case "string":
        case "boolean":
        case "bigint":
        case "number":
        case "undefined":
            break;
        case "object":
            if (value === null)
                break;
        default:
            return false;
    }
    return true;
}

export function getCopiedValue(value: any){
    switch (typeof value){
        case "string":
        case "boolean":
        case "bigint":
        case "number":
        case "undefined":
            break;
        case "object":
            if (value === null)
                break;
        default:
            throw new TypeError("value not copyable");
    }
    return value;
}
