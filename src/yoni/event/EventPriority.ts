/**
 * 事件监听的优先级。越高的优先级对事件的影响越有效，除了{@link EventPriority.MONITOR}
 */
export enum EventPriority {
    LOWEST = 0,
    LOW = 1,
    NORMAL = 2,
    HIGH = 3,
    HIGHEST = 4,
    MONITOR = 5,
}

export const EventPriorityIds: EventPriority[] = [
    EventPriority.LOWEST,
    EventPriority.LOW,
    EventPriority.NORMAL,
    EventPriority.HIGH,
    EventPriority.HIGHEST,
    EventPriority.MONITOR
]