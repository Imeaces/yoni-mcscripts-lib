export function randomName(){
    let name = "";
    let nameLength = Math.round(2 + Math.random() * 18);
    while (nameLength-- > 0){
        name += nameChars[Math.round((nameChars.length-1) * Math.random())];
    }
    return name;
}

const nameChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
