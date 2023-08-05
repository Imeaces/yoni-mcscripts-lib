import { Scoreboard } from "../scoreboard.js";

const storageDataIdx = Scoreboard.getObjective("scriptapi:storageData") ?? Scoreboard.addObjective("scriptapi:storageData");

class Storage {
    get(key: string){
    }
    set(key: string){
    }
}

export enum StorageDataType {
    string = "1",
    number = "2",
    bigint = "3",
    boolean = "4",
    plainArray = "5",
    plainObject = "6"
}

/*
object<"scriptapi:storageData">.get(name) => id

object<"scriptapi:storageGlobal">.get("id: ...") => as data
object<"scriptapi:storageIdx">.get(name) => id
object<"scriptapi:storageTrash">.get("trashes: ...") => as trashData

object<id>.get(entity) => dataIdx
object<id>.get("dataIdx: ...") => as data
*/