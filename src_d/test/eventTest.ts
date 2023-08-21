import { registerAsync, Test } from "./gametest.js";
import { randomName } from "./lib/getRandoms.js";

class Event {
    constructor(data: any){
        this.data = data;
    }
    data: any
}

async function eventTest(test: Test){
    const { EventRegistry, eventManager } = await import("yoni-mcscripts-lib");
    const registry = EventRegistry.register(Event);
    eventManager.listenEvent(Event, (event) => {
        eventData = event.data;
    });
    
    let data = randomName();
    let eventData: any = Symbol();
    let dataCopy = eventData;
    
    await test.idle(20);
    
    if (eventData !== dataCopy){
        test.fail("event handler call on unknown time");
        return;
    }
    
    eventManager.callEvent(registry, new Event(data));
    
    await test.idle(20);
    
    if (eventData === data){
        test.succeed();
    } else {
        test.fail("event handler didn't call correctly");
    }
    
    EventRegistry.unregister(Event);
}

registerAsync("yonimcscriptslib", "eventTest", eventTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
