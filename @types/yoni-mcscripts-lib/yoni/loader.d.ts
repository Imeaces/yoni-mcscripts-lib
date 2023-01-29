import { Logger } from "./util/Logger.js";
declare function Loader(basepath: any): void;
declare namespace Loader {
    var _a: void;
    export var logger: Logger;
    export { _a as default };
}
declare function load(...paths: any[]): Promise<never[]>;
declare namespace load {
    var getLoader: (base: any) => (path: any) => void;
}
export { load };
export default Loader;
export { Loader };
