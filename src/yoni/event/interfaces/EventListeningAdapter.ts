export default interface EventListeningAdapter<TEvent extends Function> {
    listen(cb: (event: TEvent["prototype"]) => void): void
    remove(): boolean
}