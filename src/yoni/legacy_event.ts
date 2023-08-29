import { Event } from "./legacy_event/Event.js";
import { EventTypes, events, EventRegisterListener } from "./legacy_event/Types.js";
import { EventSignal } from "./legacy_event/Signal.js";
import { EventListener } from "./legacy_event/Listener.js";
import { EventTrigger } from "./legacy_event/Trigger.js";
import { EventTriggerBuilder } from "./legacy_event/TriggerBuilder.js";

export {
    Event as LegacyEvent,
    EventTypes as LegacyEventTypes,
    EventSignal as LegacyEventSignal,
    EventTrigger as LegacyEventTrigger,
    EventTriggerBuilder as LegacyEventTriggerBuilder,
    EventRegisterListener as LegacyEventRegisterListener,
    EventListener as LegacyEventListener,
    events as legacyEvents,
};

import { config } from "./config.js";
if (config.getBoolean("events.enableLegacyCustomEvents", false))
import("./legacy_event/_loadEvents.js");
