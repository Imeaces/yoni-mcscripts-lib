import Minecraft from "../../minecraft.js";
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
}

interface InnerEventsOptions {
}

type AllEventOptionsEntries = UnionToTuple<DumpTupleRecordEntriesToUnion<EventOptionDefinitions>>;

type _GetEventOptionsOfEvent<Event, EventOptionsEntries> = 
    EventOptionsEntries extends [infer FirstSelection, ...infer LessSelections]
        ? FirstSelection extends [infer SelectedEvent, infer SelectedOptions]
            ? Equals<SelectedEvent, Event> extends true
                ? SelectedOptions
                : _GetEventOptionsOfEvent<Event, LessSelections>
            : _GetEventOptionsOfEvent<Event, LessSelections>
        : any

export type EventOptionType<Event> = _GetEventOptionsOfEvent<Event, AllEventOptionsEntries>;
