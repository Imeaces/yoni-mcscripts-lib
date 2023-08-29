import { Minecraft } from "../basis.js";
import { Equals } from "../lib/types";

export interface EventOptionDefinitions extends MinecraftEventsOptions, InnerEventsOptions {
}

interface MinecraftEventsOptions {
    "Minecraft.EntityHurtAfterEvent": [Minecraft.EntityHurtEvent, Partial<Minecraft.EntityEventOptions>]
    "Minecraft.EntityHitEvent": [Minecraft.EntityHitEvent, Partial<Minecraft.EntityEventOptions>]
    "Minecraft.EffectAddAfterEvent": [Minecraft.EffectAddEvent, Partial<Minecraft.EntityEventOptions>]
    "Minecraft.DataDrivenEntityTriggerAfterEvent": [Minecraft.DataDrivenEntityTriggerEvent, Partial<Minecraft.EntityDataDrivenTriggerEventOptions>]
    "Minecraft.DataDrivenEntityTriggerBeforeEvent": [Minecraft.BeforeDataDrivenEntityTriggerEvent, Partial<Minecraft.EntityDataDrivenTriggerEventOptions>]
}

interface InnerEventsOptions {
}

export type _EventOptionType2<EventType> = {
  [id in keyof EventOptionDefinitions]-?: EventOptionDefinitions[id] extends [infer Event, infer EventOpt]
      ? Equals<EventType, Event> extends true
          ? EventOpt
          : never
      : never
}[keyof EventOptionDefinitions]

export type EventOptionType<EventType> = [_EventOptionType2<EventType>] extends [never] ? any : _EventOptionType2<EventType>
