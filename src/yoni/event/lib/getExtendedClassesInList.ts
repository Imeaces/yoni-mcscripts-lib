export function getExtendedClassesInList(clazz: Function, classList: Function[]): Set<Function> {
    const classes: Set<Function> = new Set();
    classes.add(clazz);
    
    let last: number;
    do {
        last = classes.size;
        for (const class0 of classList){
            for (const class1 of classes){
                if (class1.prototype instanceof class0){
                    classes.add(class0);
                }
            }
        }
    } while (last !== classes.size);
    
    return classes;
}