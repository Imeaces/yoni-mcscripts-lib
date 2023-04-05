type Cube = { begin: Vec3 } & Vec3;
type Vec3 = { x: number, y: number, z: number };

export function divideCube(cube: Cube, maxVolume: number) {
  let cubeFactory: Cube[] = [cube];
  let cubes: Cube[] = [];

  while (cubeFactory.length > 0) {
    let cube: Cube = cubeFactory.shift() as Cube;

    let { x, y, z } = cube;
    
    if (x * y * z <= maxVolume) {
      cubes.push(cube);
      continue;
    }
    
    let outputCubes: Cube[];
    
    if (x >= y && x >= z) {
      outputCubes = divideHalfByX(cube);
    } else if (z >= x && z >= y) {
      outputCubes = divideHalfByZ(cube);
    } else if (y >= x && y >= z) {
      outputCubes = divideHalfByY(cube);
    } else {
      throw new Error("strange cube");
    }
    
    cubeFactory.push(...outputCubes);
  }

  return cubes;
}

function divideHalfByX(cube: Cube): Cube[] {
  let { begin, x, y, z } = cube;
  let { x: bX, y: bY, z: bZ } = begin;
  let x1 = Math.floor(x / 2);
  let x2 = Math.ceil(x / 2);
  bX += x1;
  return [
    { begin: { x: begin.x, y: bY, z: bZ }, x: x1, y, z },
    {
      begin: { x: bX, y: bY, z: bZ },
      x: x2,
      y,
      z,
    },
  ];
}
function divideHalfByY(cube: Cube): Cube[] {
  let { begin, x, y, z } = cube;
  let { x: bX, y: bY, z: bZ } = begin;
  let y1 = Math.floor(y / 2);
  let y2 = Math.ceil(y / 2);
  bY += y1;
  return [
    { begin: { x: bX, y: begin.y, z: bZ }, x, y: y1, z },
    {
      begin: { x: bX, y: bY, z: bZ },
      x,
      y: y2,
      z,
    },
  ];
}
function divideHalfByZ(cube: Cube): Cube[] {
  let { begin, x, y, z } = cube;
  let { x: bX, y: bY, z: bZ } = begin;
  let z1 = Math.floor(z / 2);
  let z2 = Math.ceil(z / 2);
  bZ += z1;
  return [
    { begin: { x: bX, y: bY, z: begin.z }, x, y, z: z1 },
    {
      begin: { x: bX, y: bY, z: bZ },
      x,
      y,
      z: z2,
    },
  ];
}
