import * as THREE from "three";
import { getHeight } from "./terrain";
import { theme } from "../theme";

function generateRoadPaths(): Array<Array<[number, number]>> {
  const roads: Array<Array<[number, number]>> = [];
  const road1: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.01) {
    const x = 5 + t * 90;
    const z = 50 + Math.sin(t * Math.PI * 2.3) * 15 + Math.sin(t * Math.PI * 5) * 3;
    road1.push([x, z]);
  }
  roads.push(road1);

  const road2: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.01) {
    const z = 8 + t * 84;
    const x = 35 + Math.sin(t * Math.PI * 1.8) * 12 + Math.cos(t * Math.PI * 4) * 3;
    road2.push([x, z]);
  }
  roads.push(road2);

  const road3: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.015) {
    const x = 55 + t * 35;
    const z = 25 + t * 40 + Math.sin(t * Math.PI * 3) * 5;
    road3.push([x, z]);
  }
  roads.push(road3);

  return roads;
}

export function buildRoadGroup(): THREE.Group {
  const group = new THREE.Group();
  const paths = generateRoadPaths();
  const mat = new THREE.MeshStandardMaterial({
    color: theme.road,
    roughness: 0.7,
    metalness: 0.0,
  });

  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const [x0, z0] = path[i];
      const [x1, z1] = path[i + 1];
      const y0 = getHeight(x0, z0) + 0.15;
      const y1 = getHeight(x1, z1) + 0.15;
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.sqrt(dx * dx + dz * dz);
      const mx = (x0 + x1) / 2;
      const mz = (z0 + z1) / 2;
      const my = (y0 + y1) / 2;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(len + 0.1, 0.25, 2.5), mat);
      seg.position.set(mx, my, mz);
      seg.rotation.y = -Math.atan2(dz, dx);
      seg.rotation.z = Math.atan2(y1 - y0, len);
      seg.castShadow = true;
      seg.receiveShadow = true;
      group.add(seg);
    }
  }
  return group;
}
