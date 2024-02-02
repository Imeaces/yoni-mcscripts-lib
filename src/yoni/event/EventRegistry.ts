import EventListeningAdapter from "./interfaces/EventListeningAdapter";
import IEventHandler from "./interfaces/EventHandler";
import { manager } from "./EventManager.js";
import { defaultOptionResolver } from "./lib/defaultOptionResolver.js";
import { EventPriority, EventPriorityIds } from "./EventPriority.js";
import { getExtendedClassesInList } from "./lib/getExtendedClassesInList.js";
import { EventOptionType } from "./GetEventOptions";

export class EventRegistry<TEvent extends Function> {
    #throwIfRegistered(){
        if (this.#hasRegistered)
            throw new TypeError("Deny changing the event info as it was registered");
    }
    throwIfNotRegistered(){
        if (!this.#hasRegistered)
            throw new TypeError("The event info is not registered");
    }
    #displayName?: string | undefined;
    /**
     * 该事件的便于区分的名字。
     */
    get eventName(){
        return this.#displayName ?? this.eventClass.name;
    }
    /**
     * 关联到的事件类。
     */
    readonly eventClass: TEvent;
    /**
     * 指定不扩展此事件的范围。
     */
    get noExtends(): boolean {
        return this.#noExtends;
    }
    set noExtends(v: boolean){
        this.#throwIfRegistered();
        this.#noExtends = v;
    }
    #noExtends = true;
    /**
     * 指定此事件使用额外参数在handler前过滤事件。
     */
    get extraOption(): boolean {
        return this.#extraOption;
    }
    set extraOption(v: boolean){
        this.#throwIfRegistered();
        this.#extraOption = v;
    }
    #extraOption: boolean = false;
    /**
     * 此事件在handler前过滤事件所使用的处理器。
     */
    get extraOptionResolver(): ExtraOptionResolver<TEvent> | undefined {
        return this.#extraOptionResolver;
    }
    set extraOptionResolver(v: ExtraOptionResolver<TEvent> | undefined){
        this.#throwIfRegistered();
        this.#extraOptionResolver = v;
    }
    #extraOptionResolver?: ExtraOptionResolver<TEvent>;
    /**
     * 此事件的兼容监听器。
     */
    get listeningAdapter(): EventListeningAdapter<TEvent> | undefined {
        return this.#listeningAdapter;
    }
    set listeningAdapter(v: EventListeningAdapter<TEvent> | undefined){
        this.#throwIfRegistered();
        this.#listeningAdapter = v;
    }
    #listeningAdapter?: EventListeningAdapter<TEvent>;
    /**
     * 兼容监听器是否已经启用。
     */
    #adapterEnabled: boolean = false;
    /**
     * 处理兼容监听器。
     */
    #adapter(action: "enable" | "disable"): boolean {
        if (!this.listeningAdapter)
            return false;
        
        if (action === "enable" && !this.#adapterEnabled){
            this.listeningAdapter.listen(receiveEvent);
            this.#adapterEnabled = true;
        } else if (action === "disable" && this.#adapterEnabled){
            if (this.listeningAdapter.remove()){
                this.#adapterEnabled = false;
            }
        } else {
            return false;
        }
        
        const eventRegistry = this;
        function receiveEvent(event: TEvent){
            manager.callEvent(eventRegistry, event);
        }
        
        return true;
    }
    
    /**
     * will initialize on {@link EventRegistry##sortHandlers}
     */
    #handlers?: IEventHandler<TEvent>[]
    get #sorted(): boolean {
        return this.#handlers != undefined;
    }
    set #sorted(hasSorted){
        if (!hasSorted)
            this.#handlers = undefined;
    }
    #sortHandlers(): void {
        if (this.#sorted)
            return;
        
        const sortedHandlersList = EventPriorityIds
            .sort((va, vb) => va - vb)
            .map(id => this.handlerslots.get(id) as IEventHandler<TEvent>[])
            .flat();
        this.#handlers = sortedHandlersList;
        this.#sorted = true;
    }
    get handlers(){
        this.#sortHandlers();
        return this.#handlers as IEventHandler<TEvent>[];
    }
    
    handlerslots: Map<EventPriority, IEventHandler<TEvent>[]> = new Map(
        // 此处为每个事件优先级初始化一个用于存储事件处理器的列表
        EventPriorityIds.map(prio => [
            prio as EventPriority,
            [] as IEventHandler<TEvent>[]
        ])
    );
    
    get hasRegistered(){
        return this.#hasRegistered;
    }
    #hasRegistered: boolean = false;
    private constructor(eventClass: TEvent){
        // 多一次无用操作起码比类型报错好
        this.eventClass = eventClass;
        Object.defineProperty(this, "eventClass", { value: eventClass });
    }
    addHandler(handler: IEventHandler<TEvent>, priority: EventPriority){
        if ((this.handlerslots.get(priority) as IEventHandler<TEvent>[]).includes(handler)){
            throw new Error("registered");
        }
        this.#sorted = false;
        this.handlerslots.get(priority)?.push(handler); //实际上不会也不应该出现空槽位结果，除非传入的priority不正确
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
    
    /**
     * 注销事件信息。
     */
    static unregister<TEvent extends Function>(eventClass: TEvent | EventRegistry<TEvent>): boolean {
        if (eventClass instanceof EventRegistry)
            eventClass = eventClass.eventClass;
        
        if (!EventRegistry.#registries.has(eventClass)){
            return false;
        }
        
        const registry = EventRegistry.#registries.get(eventClass) as unknown as EventRegistry<TEvent>;
        registry.handlerslots.clear(); //看上去这会破坏什么东西
        registry.#sorted = false;
        
        registry.#adapter("disable");
        
        registry.#hasRegistered = false;
        
        EventRegistry.#extendsClassesCache = undefined;
        EventRegistry.#registries.delete(eventClass);
        return true;
    }
    /**
     * 注册事件信息。
     */
    static register<TEvent extends Function>(eventClass: EventRegistry<TEvent> | TEvent, option?: EventRegisterOptions<TEvent>): EventRegistry<TEvent> {
        let registry;
        if (eventClass instanceof EventRegistry){
            registry = eventClass;
            eventClass = registry.eventClass;
        } else {
            registry = new EventRegistry<TEvent>(eventClass);
        }
        
        registry.#throwIfRegistered();

        if (option){
            EventRegistry.#setRegistryOption(registry, option);
        }
        
        if (registry.#adapter != null
        && !registry.#adapterEnabled
        && registry.handlers.length !== 0){
            registry.#adapter("enable");
        }
        
        registry.#hasRegistered = true;

        EventRegistry.#extendsClassesCache = undefined;
        EventRegistry.#registries.set(eventClass, registry as any /** 暂时不知道怎么解决 */);
        return registry;
    }
    static #setRegistryOption<TEvent extends Function>(eventRegistry: EventRegistry<TEvent>, option: EventRegisterOptions<TEvent>): void {
        eventRegistry.#throwIfRegistered();
        eventRegistry.noExtends = option.noExtends ?? eventRegistry.noExtends;
        eventRegistry.extraOption = option.extraOption ?? eventRegistry.extraOption;
        eventRegistry.extraOptionResolver = option.extraOptionResolver ?? defaultOptionResolver;
        eventRegistry.listeningAdapter = option.listeningAdapter ?? eventRegistry.listeningAdapter;
        eventRegistry.#displayName = option.displayName ?? undefined;
    }
    /**
     * 获取一个事件所对应的事件信息对象。
     */
    static getRegistry<TEvent extends Function>(eventClass: TEvent): EventRegistry<TEvent> {
        let registry = EventRegistry.#registries.get(eventClass);
        if (registry != null){
            return registry as unknown as EventRegistry<TEvent>;
        }
        
        const newRegistry = new EventRegistry<TEvent>(eventClass);
        EventRegistry.#registries.set(eventClass, newRegistry as any /* 不会写这个类型 */);
        
        return newRegistry;
    }
    static getExtends<
        T extends EventRegistry<TEvent>,
        TEvent extends Function = T["eventClass"]
    >(registry: T): EventRegistry<Function>[] {
        const extendsClasses = EventRegistry.#extendsClasses;
        const matchedClasses = [];
        for (const clazz of extendsClasses){
            if (getExtendedClassesInList(clazz, extendsClasses)){
                matchedClasses.push(clazz);
            }
        }
        return matchedClasses.map(clazz => EventRegistry.getRegistry(clazz));
    }
    static #registries = new Map<Function, EventRegistry<Function>>();
    static #extendsClassesCache?: Function[];
    static get #extendsClasses(): Function[] {
        if (EventRegistry.#extendsClassesCache != null){
            return EventRegistry.#extendsClassesCache;
        }

        const extendsClasses: Function[] = [];
        
        for (const er of EventRegistry.#registries.values()){
            if (!er.noExtends){
                extendsClasses.push(er.eventClass);
            }
        }
        
        EventRegistry.#extendsClassesCache = extendsClasses;
        
        return extendsClasses;
    }
}

/**
 * 事件注册所需要的信息。
 */
export interface EventRegisterOptions<TEvent extends Function> {
    noExtends?: boolean
    extraOption?: boolean
    extraOptionResolver?: ExtraOptionResolver<TEvent>
    listeningAdapter?: EventListeningAdapter<TEvent>
    displayName?: string
}

export type ExtraOptionResolver<TEvent extends Function> = (event: Prototype<TEvent>, option: EventOptionType<Prototype<TEvent>>) => boolean

type Prototype<TFunction extends Function> = TFunction["prototype"];
