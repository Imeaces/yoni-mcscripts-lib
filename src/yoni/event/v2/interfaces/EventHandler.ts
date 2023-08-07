export default interface EventHandler<TEvent extends Function> {
    onEvent(event: TEvent["prototype"]): any
    ignoreCancelled: boolean
    option?: any
}
