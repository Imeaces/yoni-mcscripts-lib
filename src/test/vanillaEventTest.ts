import { EntityDieAfterEvent, Entity } from "./minecraft.js";
import { registerAsync, Test } from "./gametest.js";
import { randomName } from "./lib/getRandoms.js";

async function vanillaEventTest(test: Test){
    const { eventManager } = await import("yoni-mcscripts-lib");
    
    const entity1 = test.spawnWithoutBehaviors("minecraft:warden", { x: 0, y: 0, z: 0 });
    const entity2 = test.spawnWithoutBehaviors("minecraft:warden", { x: 0, y: 0, z: 1 });
    
    const listener = eventManager.listenEvent({
        event: EntityDieAfterEvent,
        eventOptions: {
            entities: [entity1]
        }
    }, (event) => {
        deadEntity = event.deadEntity;
        callTimes += 1;
    });
    
    let deadEntity: Entity | null = null;
    let callTimes: number = 0;
    
    try {
        await test.idle(20);
        
        if (deadEntity !== null){
            throw "deadEntity existing on entity didn't be kill";
        }
        
        entity2.kill();
        
        await test.idle(20);
        
        if (deadEntity !== null){
            throw "deadEntity existing on entity didn't is the target of event";
        }
        
        entity1.kill();
        
        await test.idle(20);
        
        if (deadEntity !== entity1){
            throw "deadEntity doesn't match to the target of event";
        }
        
    } catch(e){
        test.fail(e as string);
    }
    
    eventManager.removeListener(listener);
    
    test.succeed();
}

registerAsync("yonimcscriptslib", "vanillaEventTest", vanillaEventTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
