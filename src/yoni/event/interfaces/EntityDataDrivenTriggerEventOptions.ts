import EntityEventOptions from "./EntityEventOptions";

/**
 * @beta
 * Specifies additional filters that are used in registering a
 * data driven trigger event for entities.
 */
export default interface EntityDataDrivenTriggerEventOptions extends EntityEventOptions {
    /**
     * @remarks
     * If this value is set, this event will only fire if the
     * impacted triggered event matches one of the events listed in
     * this parameter.
     *
     */
    eventTypes?: string[];
}

