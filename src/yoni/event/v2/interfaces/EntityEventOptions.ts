import { EntityValue } from "../../../entity/EntityTypeDefs.js";

/**
 * @beta
 * Contains optional parameters for registering an entity
 * event.
 */
export default interface EntityEventOptions {
    /**
     * @remarks
     * If this value is set, this event will only fire for entities
     * that match the entities within this collection.
     *
     */
    entities?: EntityValue[];
    /**
     * @remarks
     * If this value is set, this event will only fire if the
     * impacted entities' type matches this parameter.
     *
     */
    entityTypes?: string[];
}
