export interface FunctionParamsOverrideResult {
    hasResult: true
    result: any
}

export interface FunctionParamsOverrideCondition<Argc extends number> {
    argc: Argc
    condition(useArgc: Argc, currentArgs: any[]): boolean
}
export interface FunctionParamsOverrideEntry {
    overrides: FunctionParamsOverrideCondition<number>[]
    func(params: any[]): any
}

export class FunctionParamsOverrides {
    addOverrides(overrides: FunctionParamsOverrideCondition<number>[], func: (params: any[]) => any): void {
        this.entries.push({ overrides, func });
    }
    entries: FunctionParamsOverrideEntry[] = [];
    match(params: any[]): FunctionParamsOverrideResult | undefined {
    
        EntryFilter:
        for (const entry of this.entries){
            
            let paramsCopy = params.slice(0);
            
            const { overrides, func } = entry;
            
            let requireArgc = overrides.reduce((argc, over) => argc + over.argc, 0);
            
            if (params.length !== requireArgc)
                continue;
            
            for (const over of overrides){
                const { argc, condition } = over;
                
                const condParams = paramsCopy.splice(0, argc);
                
                if (!condition(argc, condParams)){
                    continue EntryFilter; //not match, next entry
                }
            }
            
            // matched, generate result
            const result = func(params);
            return {
                hasResult: true,
                result
            };
        }
        
        // no reault
        return undefined;
    }
}
