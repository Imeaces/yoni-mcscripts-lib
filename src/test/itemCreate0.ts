import { registerAsync, Test } from "./gametest.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

const defaultConstantItemEnchants = [
    { type: "binding", "level": 1 },
    { type: "unbreaking", "level": 1 },
];

const defaultItemEnchants = [
    { type: "binding", "level": 1 },
    { type: "unbreaking", "level": 1 },
    { type: "vanishing", "level": 1 }
];

async function getPlayerTest(test: Test){
    const { ItemCreator, Minecraft } = await import("yoni-mcscripts-lib");
    let item1 = new ItemCreator("iron_helmet")
        .setKeepOnDeath(true)
        .addEnchants(defaultConstantItemEnchants)
        .itemStack;
    
    let item2 = new ItemCreator(item1.clone()).setType("elytra", true).itemStack;
    let item3 = new ItemCreator(item1.clone()).setType("chainmail_leggings", true).itemStack;
    let item4 = new ItemCreator(item1.clone()).setType("iron_boots", true).itemStack;
    
    let item5 = new ItemCreator("minecraft:firework_rocket")
        .setKeepOnDeath(true).setLockMode(Minecraft.ItemLockMode.inventory)
        .setAmount(3).itemStack;
    
    let item6 = new ItemCreator("minecraft:shield")
        .setKeepOnDeath(true).setLockMode(Minecraft.ItemLockMode.slot)
        .addEnchants(defaultConstantItemEnchants)
        .itemStack;
        
    test.succeed();
}

registerAsync("yonimcscriptslib", "itemCreate0", getPlayerTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
