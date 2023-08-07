export function defaultOptionResolver<T extends {}>(event: T, option: T): boolean {
    for (const prop in event)
        if (prop in option && !Object.is(event[prop], option[prop]))
            return false;
    return true;
}