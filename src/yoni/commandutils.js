/**
 * 这个函数用于处理Minecraft会进行转换的反引号以避免出现错误。
 */
export function dealWithCmd(key, value){
    if (typeof value === "string"){
        //“”„‟
        value = value.replaceAll(/[\u201c-\u201f]/g, "\"");
        //‘’‚‛
        value = value.replaceAll(/[\u2018-\u201b]/g, "'");
    }
    return value;
}
