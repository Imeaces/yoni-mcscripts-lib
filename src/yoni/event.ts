export { Event } from "./event/v2/base/Event.js";
export { VanillaEvent } from "./event/v2/base/VanillaEvent.js";
export { EventPriority } from "./event/v2/EventPriority.js";
export { EventRegistry } from "./event/v2/EventRegistry.js";
export { eventManager } from "./event/v2/EventManager.js";
export { default as IEventListener } from "./event/v2/interfaces/EventListener";
export { default as IEventHandler } from "./event/v2/interfaces/EventHandler";
export { default as IEventSignal } from "./event/v2/interfaces/IEventSignal";
export { default as EventListeningAdapter } from "./event/v2/interfaces/EventListeningAdapter";
export { default as TypedEventSignal } from "./event/v2/interfaces/TypedEventSignal";
export { listenEvent } from "./event/v2/lib/listenEvent.js";
export { EventHandler } from "./event/v2/decorators/EventHandler.js";
export { EventListener } from "./event/v2/decorators/EventListener.js";
export { EventSignalListeningAdapter } from "./event/v2/adapting/EventSignalListeningAdapter.js";
export { EventOptionType, EventOptionDefinitions } from "./event/v2/GetEventOptions"

import { registerMinecraftNativeEvents } from "./event/v2/lib/eventRegistration.js";
registerMinecraftNativeEvents();

import { registerMinecraftEventOptionResolvers } from "./event/v2/adapting/eventOptions/MinecraftEventOptionResolvers.js";
registerMinecraftEventOptionResolvers();

export { PlayerJoinedEvent } from "./event/v2/player/PlayerJoinedEvent.js";
