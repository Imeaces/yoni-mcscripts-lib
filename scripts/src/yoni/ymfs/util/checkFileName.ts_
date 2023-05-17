export function checkFileName(name: string){
    if (name.length > 64)
        throw new Error();
    
    if (name === ".")
        return false;
    if (name === "..")
        return false;
    
    if (name.indexOf("/") !== -1)
        throw new Error();
    
    if (name.indexOf("\u0000") !== -1)
        throw new Error();
    
}
