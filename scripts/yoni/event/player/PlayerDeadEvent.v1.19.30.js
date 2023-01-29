import { World } from "../../world.js";
import { YoniScheduler } from "../../schedule.js";
import { PlayerDeadEventSignal, PlayerDeadEvent } from "./PlayerDeadEvent.js";
import { EventTriggerBuilder } from "../../event.js";
const deadPlayers = new Set();
let eventId0;
let eventId1;
const trigger = new EventTriggerBuilder()
    .id("yoni:playerDead")
    .eventSignalClass(PlayerDeadEventSignal)
    .eventClass(PlayerDeadEvent)
    .whenFirstSubscribe(() => {
    eventId0 = YoniScheduler.runCycleTickTask(() => {
        World.getPlayers().forEach(player => {
            const currentHealth = player.getCurrentHealth();
            if (deadPlayers.has(player)) {
                if (currentHealth > 0)
                    deadPlayers.delete(player);
            }
            else if (currentHealth <= 0) {
                deadPlayers.add(player);
                trigger.triggerEvent(player);
            }
        });
    }, 0, 1);
    eventId1 = EventListener.register("yoni:playerJoined", (event) => {
        if (event.player.getCurrentHealth() <= 0) {
            deadPlayers.add(event.player);
        }
    });
})
    .whenLastUnsubscribe(() => {
    EventListener.unregister(eventId0);
    EventListener.unregister(eventId1);
})
    .build()
    .registerEvent();
