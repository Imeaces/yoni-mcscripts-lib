declare type Cube = {
    begin: Vec3;
} & Vec3;
declare type Vec3 = {
    x: number;
    y: number;
    z: number;
};
export declare function divideCube(cube: Cube, maxVolume: number): Cube[];
export {};
