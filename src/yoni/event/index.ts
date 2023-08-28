//types
export { default as IEventListener } from "./interfaces/EventListener";
export { default as IEventHandler } from "./interfaces/EventHandler";
export { default as IEventSignal } from "./interfaces/IEventSignal";
export { default as EventListeningAdapter } from "./interfaces/EventListeningAdapter";
export { default as TypedEventSignal } from "./interfaces/TypedEventSignal";

//base system
export { EventRegistry } from "./EventRegistry.js";
export { EventSignalListeningAdapter } from "./adapting/EventSignalListeningAdapter.js";
export { EventOptionType, EventOptionDefinitions } from "./GetEventOptions"

export { Event } from "./base/Event.js";
export { VanillaEvent } from "./base/VanillaEvent.js";

export { EventPriority } from "./EventPriority.js";
export { EventHandler } from "./decorators/EventHandler.js";
export { EventListener } from "./decorators/EventListener.js";

export { eventManager } from "./EventManager.js";
export { listenEvent } from "./lib/listenEvent.js";

import { registerMinecraftNativeEvents } from "./lib/eventRegistration.js";
registerMinecraftNativeEvents();

import { registerMinecraftEventOptionResolvers } from "./adapting/eventOptions/MinecraftEventOptionResolvers.js";
registerMinecraftEventOptionResolvers();

