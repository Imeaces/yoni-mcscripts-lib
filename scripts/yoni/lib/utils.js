export const getKeys = (object)=>{
    let sa = object;
    let keys = [];
    while (sa !== null){
        Object.getOwnPropertyNames(sa).forEach(key=>{
            if (!keys.includes(key)){
                keys.push(key);
            }
        });
        sa = Object.getPrototypeOf(sa);
    }
    return keys;
}