import * as THREE from "three";
import { theme } from "../theme";

function makeNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad2: Array<[number, number]> = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];
  const dot2 = (g: [number, number], x: number, y: number) => g[0] * x + g[1] * y;
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);

  return function noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    return lerp(
      lerp(dot2(grad2[aa % 8], xf, yf), dot2(grad2[ba % 8], xf - 1, yf), u),
      lerp(dot2(grad2[ab % 8], xf, yf - 1), dot2(grad2[bb % 8], xf - 1, yf - 1), u),
      v,
    );
  };
}

const noise = makeNoise();
const noise2 = makeNoise();
const noise3 = makeNoise();

export function getHeight(x: number, z: number): number {
  const s = 0.018;
  let h = noise(x * s, z * s) * 8;
  h += noise2(x * s * 2.2, z * s * 2.2) * 3;
  h += noise3(x * s * 4.5, z * s * 4.5) * 1.2;
  const cx = (x - 50) / 50;
  const cz = (z - 50) / 50;
  const r = Math.sqrt(cx * cx + cz * cz);
  h += Math.max(0, (1 - r) * 5);
  return h;
}

export const TERRAIN_SIZE = 100;
export const TERRAIN_RES = 200;
export const CONTOUR_RES = 150;
export const CONTOUR_INTERVAL = 1;

export function buildTerrainMesh(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_RES, TERRAIN_RES);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + TERRAIN_SIZE / 2;
    const z = pos.getZ(i) + TERRAIN_SIZE / 2;
    pos.setY(i, getHeight(x, z));
    pos.setX(i, x);
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: theme.terrain,
    roughness: 0.9,
    metalness: 0.0,
    flatShading: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function buildBasePlatform(): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({
    color: theme.platform,
    roughness: 0.85,
    metalness: 0.0,
  });
  const geo = new THREE.BoxGeometry(120, 2, 120);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(50, -2, 50);
  mesh.receiveShadow = true;
  return mesh;
}

function generateContourSegments(res: number, size: number, interval: number): number[][] {
  const lines: number[][] = [];
  const step = size / res;
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      const x0 = i * step;
      const z0 = j * step;
      const x1 = (i + 1) * step;
      const z1 = (j + 1) * step;
      const h00 = getHeight(x0, z0);
      const h10 = getHeight(x1, z0);
      const h01 = getHeight(x0, z1);
      const h11 = getHeight(x1, z1);
      const hMin = Math.floor(Math.min(h00, h10, h01, h11) / interval) * interval;
      const hMax = Math.ceil(Math.max(h00, h10, h01, h11) / interval) * interval;
      for (let level = hMin; level <= hMax; level += interval) {
        const pts: Array<[number, number, number]> = [];
        const edges: Array<[number, number, number, number, number, number]> = [
          [x0, z0, h00, x1, z0, h10],
          [x1, z0, h10, x1, z1, h11],
          [x1, z1, h11, x0, z1, h01],
          [x0, z1, h01, x0, z0, h00],
        ];
        for (const [ax, az, ah, bx, bz, bh] of edges) {
          if ((ah <= level && bh > level) || (bh <= level && ah > level)) {
            const t = (level - ah) / (bh - ah);
            pts.push([ax + t * (bx - ax), level, az + t * (bz - az)]);
          }
        }
        if (pts.length >= 2) {
          lines.push(pts[0], pts[1]);
        }
      }
    }
  }
  return lines;
}

export function buildContourGroup(): THREE.Group {
  const group = new THREE.Group();
  const segments = generateContourSegments(CONTOUR_RES, TERRAIN_SIZE, CONTOUR_INTERVAL);
  const mat = new THREE.LineBasicMaterial({ color: theme.contour });
  for (let i = 0; i < segments.length; i += 2) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(segments[i][0], segments[i][1] + 0.05, segments[i][2]),
      new THREE.Vector3(segments[i + 1][0], segments[i + 1][1] + 0.05, segments[i + 1][2]),
    ]);
    group.add(new THREE.Line(geo, mat));
  }
  return group;
}
