/**
 * @param {any} msg
 * @param {any} err
 */
export function getErrorMsg(msg="", err=msg){
    let errMsg = "";
    if (err instanceof Error){
        errMsg += `${err.name}: ${err.message}`;
        if (err.stack !== undefined)
            errMsg += `\n${err.stack}`;
    } else {
        errMsg = String(err);
    }
    return { msg: msg, errMsg: errMsg };
}
