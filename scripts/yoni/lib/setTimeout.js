
let cfid = 1;
const taskMap = new Map();

export function setTimeout(f, i){
    const fid = cfid++;
    taskMap.set(fid, f);
    countTimeAndRun(fid, i);
    return fid;
}

async function hasTask(fid){
    return taskMap.has(fid);
}
async function getTimeMs(){
    return Date.now();
}
async function countTimeAndRun(fid, i){
    const startTime = Date.now();
    while (await hasTask(fid)){
        const currentTime = await getTimeMs();
        let f = null;
        if (currentTime - startTime >= i
        || currentTime < startTime){
            f = taskMap.get(fid);
        }
        if (f){
            f();
            return;
        }
    }
}
