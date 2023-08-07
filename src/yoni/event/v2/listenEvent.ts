export function listenEvent<TFunction extends Function>(event: TFunction, callback: (arg: TFunction["prototype"]) => void){
}

export function listenAsyncEvent<TFunction extends Function>(event: TFunction, callback: (arg: TFunction["prototype"]) => Promise<void>){
}
