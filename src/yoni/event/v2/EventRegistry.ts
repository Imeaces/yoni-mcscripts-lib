import EventListeningAdapter from "./interfaces/EventListeningAdapter";
import IEventHandler from "./interfaces/EventHandler";
import { manager } from "./EventManager.js";
import { defaultOptionResolver } from "./lib/defaultOptionResolver.js";
import { EventPriority, EventPriorityIds } from "./EventPriority.js";
import { getExtendedClassesInList } from "./lib/getExtendedClassesInList.js";
import { EventOptionType } from "./GetEventOptions";

export class EventRegistry<TEvent extends Function> {
    #displayName?: string | undefined;
    get eventName(){
        return this.#displayName ?? this.eventClass.name;
    }
    eventClass: TEvent;
    noExtends: boolean = true;
    extraOption: boolean = false;
    extraOptionResolver?: ExtraOptionResolver<TEvent>;
    listeningAdapter?: EventListeningAdapter<TEvent>;
    #adapterEnabled: boolean = false;
    #adapter(action: "enable" | "disable"): boolean {
        if (!this.listeningAdapter)
            return false;
        
        if (action === "enable" && !this.#adapterEnabled){
            const eventRegistry = this;
            this.listeningAdapter.listen(function receiveOuterEvent(event: TEvent){
                manager.callEvent(eventRegistry, event);
            });
            this.#adapterEnabled = true;
        } else if (action === "disable" && this.#adapterEnabled){
            if (this.listeningAdapter.remove()){
                this.#adapterEnabled = false;
            }
        } else {
            return false;
        }
        
        return true;
    }
    
    /**
     * will initialize on {@link EventRegistry#sortHandlers}
     */
    // @ts-ignore 故意不初始化的
    handlers: IEventHandler<TEvent>[]
    
    handlerslots: Map<EventPriority, IEventHandler<TEvent>[]> = new Map(EventPriorityIds.map(v => [v as EventPriority, [] as IEventHandler<TEvent>[]]));
    #sorted: boolean = false;
    sortHandlers(): void {
        if (this.#sorted)
            return;
        
        const sortedHandlersList = EventPriorityIds
            .sort((va, vb) => va - vb)
            .map(id => this.handlerslots.get(id) as IEventHandler<TEvent>[])
            .flat();
        this.handlers = sortedHandlersList;
        this.#sorted = true;
    }
    
    private constructor(eventClass: TEvent, option?: EventRegisterOptions<TEvent>){
        this.eventClass = eventClass;
        if (option){
            this.noExtends = option.noExtends ?? this.noExtends;
            this.extraOption = option.extraOption ?? this.extraOption;
            this.extraOptionResolver = option.extraOptionResolver ?? defaultOptionResolver;
            this.listeningAdapter = option.listeningAdapter ?? this.listeningAdapter;
            this.#displayName = option.displayName ?? undefined;
        }
    }
    addHandler(handler: IEventHandler<TEvent>, priority: EventPriority){
        if ((this.handlerslots.get(priority) as IEventHandler<TEvent>[]).includes(handler)){
            throw new Error("registered");
        }
        this.#sorted = false;
        this.handlerslots.get(priority)?.push(handler); //实际上不会也不应该出现空槽位结果
        this.#adapter("enable");
    }
    removeHandler(handler: IEventHandler<TEvent>, priority: EventPriority): boolean {
        const handlers = this.handlerslots.get(priority) as IEventHandler<TEvent>[];
        
        const location = handlers.indexOf(handler);
        if (location === -1){
            return false;
        }
        
        this.#sorted = false;
        handlers.splice(location, 1);
        return true;
    }
    setHandlerResolver(resolver: ExtraOptionResolver<TEvent>): void {
        if (!this.extraOption)
            throw new TypeError("this registry cannot specific any extra options");
        
    }
        //TODO: implements extraOption
        //return [];
    
    static unregister<TEvent extends Function>(eventClass: TEvent | EventRegistry<TEvent>): boolean {
        if (eventClass instanceof EventRegistry)
            eventClass = eventClass.eventClass;
        
        if (!EventRegistry.#registries.has(eventClass)){
            return false;
        }
        
        const registry = EventRegistry.#registries.get(eventClass) as unknown as EventRegistry<TEvent>;
        registry.handlerslots.clear();
        registry.#sorted = false;
        
        registry.#adapter("disable");
        
        EventRegistry.#registries.delete(eventClass);
        return true;
    }
    static register<TEvent extends Function>(eventClass: TEvent, option?: EventRegisterOptions<TEvent>): EventRegistry<TEvent> {
        if (EventRegistry.#registries.has(eventClass)){
            throw new Error("this event already been registered");
        }
        
        const registry = new EventRegistry<TEvent>(eventClass, option);
        
        EventRegistry.#registries.set(eventClass, registry as any /** 暂时不知道怎么解决 */);
        return registry;
    }
    static getRegistry<TEvent extends Function>(eventClass: TEvent): EventRegistry<TEvent> {
        if (!this.#registries.has(eventClass)){
            throw new ReferenceError("no such registry");
        }
        return this.#registries.get(eventClass) as unknown as EventRegistry<TEvent>;
    }
    static #registries = new Map<Function, EventRegistry<Function>>();
    static getExtends<T extends EventRegistry<TEvent>, TEvent extends Function = T["eventClass"]>(registry: T): EventRegistry<Function>[] {
        let extendsClasses = [...this.#registries.entries()]
            .filter(er => !er[1].noExtends)
            .map(er => er[0]);
        return [...getExtendedClassesInList(registry.eventClass, extendsClasses)].map(f => EventRegistry.getRegistry(f));
    }
}

export interface EventRegisterOptions<TEvent extends Function> {
    noExtends?: boolean
    extraOption?: boolean
    extraOptionResolver?: ExtraOptionResolver<TEvent>
    listeningAdapter?: EventListeningAdapter<TEvent>
    displayName?: string
}

export type ExtraOptionResolver<TEvent extends Function> = (event: TEvent["prototype"], option: EventOptionType<TEvent["prototype"]>) => boolean

type Prototype<TFunction extends Function> = TFunction["prototype"];
