export default Loader;
export function load(...paths: any[]): Promise<any[]>;
export namespace load {
    function getLoader(base: any): (path: any) => void;
}
export function Loader(basepath: any): void;
export class Loader {
    constructor(basepath: any);
    basedir: string;
    getPath(path: any): string;
    load(...paths: any[]): void;
}
export namespace Loader {
    const _default: void;
    export { _default as default };
    export const logger: Logger;
}
import { Logger } from "./util/Logger.js";
