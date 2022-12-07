export function load(...paths: any[]): Promise<void>;
export namespace load {
    function getLoader(base: any): (path: any) => void;
}
