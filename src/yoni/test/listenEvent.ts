import { eventManager } from "../index.js";
import { EntityHitEntityAfterEvent } from "@minecraft/server";

eventManager.listenEvent({
    event: EntityHitEntityAfterEvent,
    eventOptions: {
        entityTypes: ["99", "3883@"]
    }
}, (event) => {
    event.hitEntity;
});