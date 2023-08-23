import { Event } from "./event/Event.js";
import { EventTypes, events, EventRegisterListener } from "./event/Types.js";
import { EventSignal } from "./event/Signal.js";
import { EventListener } from "./event/Listener.js";
import { EventTrigger } from "./event/Trigger.js";
import { EventTriggerBuilder } from "./event/TriggerBuilder.js";

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
import("./event/_loadEvents.js");
