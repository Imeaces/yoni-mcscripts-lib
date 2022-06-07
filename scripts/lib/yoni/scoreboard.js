import default from "scripts/lib/yoni/basis.js";



export function addObjective(objective, displayName){
  objective = String(objective);
  displayName = String(displayName);
  if (string2Byte(objective).length < 16)
    throw new Error()
  if (string2Byte(displayName).length < 32)
    throw new Error()
  
  dim(0).runCommand
  
}

function removeObjective(objective){
}

function getObjective(){
}

function setScore(objective, object){
}

function getScore(objective, object){
}

function addScore(objective, object){
}

function removeScore(objective, object){
}

function resetScore(objective, object){
}

function operationScore(objective, object){
}

export default class Scoreboard {
  constructor(){
  }
}





















function string2Byte(data) {

    let parsedData = [];

    for (let i = 0, l = data.length; i < l; i++) {
        let byteArray = [];
        // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码，返回值是 0 - 65535 
        // 之间的整数，表示给定索引处的 UTF-16 代码单元。
        let code = data.charCodeAt(i);

    // 十六进制转十进制：0x10000 ==> 65535  0x800 ==> 2048  0x80 ==> 128
    if (code > 0x10000) { // 4个字节
        // 0xf0 ==> 11110000 
        // 0x80 ==> 10000000

        byteArray[0] = 0xf0 | ((code & 0x1c0000) >>> 18); // 第 1 个字节
        byteArray[1] = 0x80 | ((code & 0x3f000) >>> 12); // 第 2 个字节
        byteArray[2] = 0x80 | ((code & 0xfc0) >>> 6); // 第 3 个字节
        byteArray[3] = 0x80 | (code & 0x3f); // 第 4 个字节

    } else if (code > 0x800) { // 3个字节
        // 0xe0 ==> 11100000
        // 0x80 ==> 10000000

        byteArray[0] = 0xe0 | ((code & 0xf000) >>> 12);
        byteArray[1] = 0x80 | ((code & 0xfc0) >>> 6);
        byteArray[2] = 0x80 | (code & 0x3f);

    } else if (code > 0x80) { // 2个字节
        // 0xc0 ==> 11000000
        // 0x80 ==> 10000000

        byteArray[0] = 0xc0 | ((code & 0x7c0) >>> 6);
        byteArray[1] = 0x80 | (code & 0x3f);

    } else { // 1个字节

        byteArray[0] = code;
    }

        parsedData.push(byteArray);
    }

    parsedData = Array.prototype.concat.apply([], parsedData);
    return parsedData;
}
