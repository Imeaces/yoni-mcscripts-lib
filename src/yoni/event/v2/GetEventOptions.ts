import { Minecraft } from "../../basis.js";
import { Equals, UnionToTuple, DumpTupleRecordEntriesToUnion } from "../../lib/types";

export interface EventOptionDefinitions extends MinecraftEventsOptions, InnerEventsOptions {
}

interface MinecraftEventsOptions {
    "Minecraft.EntityRemovedAfterEvent": [Minecraft.EntityRemovedAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EntityHurtAfterEvent": [Minecraft.EntityHurtAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EntityHitEntityAfterEvent": [Minecraft.EntityHitEntityAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EntityHitBlockAfterEvent": [Minecraft.EntityHitBlockAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EntityHealthChangedAfterEvent": [Minecraft.EntityHealthChangedAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EntityDieAfterEvent": [Minecraft.EntityDieAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.EffectAddAfterEvent": [Minecraft.EffectAddAfterEvent, Minecraft.EntityEventOptions]
    "Minecraft.DataDrivenEntityTriggerAfterEvent": [Minecraft.DataDrivenEntityTriggerAfterEvent, Minecraft.EntityDataDrivenTriggerEventOptions]
    "Minecraft.DataDrivenEntityTriggerBeforeEvent": [Minecraft.DataDrivenEntityTriggerBeforeEvent, Minecraft.EntityDataDrivenTriggerEventOptions]
    "Minecraft.ScriptEventCommandMessageAfterEvent": [Minecraft.ScriptEventCommandMessageAfterEvent, Minecraft.ScriptEventMessageFilterOptions]
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
