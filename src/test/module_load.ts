import { registerAsync, Test } from "./gametest.js";
import { getErrorMsg } from "./lib/getErrorMsg.js";

async function loadTest(test: Test){
    await import("yoni-mcscripts-lib");
    test.succeed();
}

registerAsync("yonimcscriptslib", "module_load", loadTest)
    .structureName("yonimcscriptslib:single_void_structure")
    .tag("yonimcscriptslib")
    .maxTicks(300*20);
