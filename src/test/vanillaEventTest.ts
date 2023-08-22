import { EntityHurtEvent, Entity } from "./minecraft.js";
import { registerAsync, Test } from "./gametest.js";
import { randomName } from "./lib/getRandoms.js";

async function vanillaEventTest(test: Test){
    const { eventManager, Location } = await import("yoni-mcscripts-lib");
    
    const entity1 = test.spawnWithoutBehaviors("minecraft:warden", Location.zero.getVanillaBlockLocation());
    const entity2 = test.spawnWithoutBehaviors("minecraft:warden", Location.zero.offset(0,0,1).getVanillaBlockLocation());
    
    const listener = eventManager.listenEvent({
        event: EntityHurtEvent,
        eventOptions: {
            entities: [entity1]
        }
    }, (event) => {
        hurtEntity = event.hurtEntity;
        callTimes += 1;
    });
    
    let hurtEntity: Entity | null = null;
    let callTimes: number = 0;
    
    try {
        await test.idle(20);
        
        if (hurtEntity !== null){
            throw "hurtEntity existing on entity didn't be damage";
        }
        
        entity2.runCommand("damage @s 1");
        
        await test.idle(20);
        
        if (hurtEntity !== null){
            throw "hurtEntity existing on entity didn't is the target of event";
        }
        
        entity1.runCommand("damage @s 1");
        
        await test.idle(20);
        
        if (hurtEntity !== entity1){
            throw "hurtEntity doesn't match to the target of event";
        }
        
    } catch(e){
        test.fail(e as string);
    }
    
    eventManager.removeListener(listener);
    test.killAllEntities();
    
    test.succeed();
}

registerAsync("yonimcscriptslib", "vanillaEventTest", vanillaEventTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
