import * as THREE from "three";
import { getHeight } from "./terrain";
import { theme } from "../theme";

export type Building = {
  id: string;
  x: number;
  z: number;
  w: number;
  d: number;
  floors: number;
};

const FLOOR_HEIGHT = 3.2;

const SEED_FOOTPRINTS: Array<Omit<Building, "id">> = [
  { x: 30, z: 45, w: 6, d: 4, floors: 3 },
  { x: 38, z: 48, w: 4, d: 8, floors: 5 },
  { x: 33, z: 55, w: 5, d: 5, floors: 2 },
  { x: 45, z: 40, w: 8, d: 5, floors: 4 },
  { x: 50, z: 52, w: 3, d: 3, floors: 7 },
  { x: 55, z: 48, w: 6, d: 4, floors: 3 },
  { x: 60, z: 55, w: 5, d: 6, floors: 2 },
  { x: 42, z: 60, w: 4, d: 4, floors: 6 },
  { x: 65, z: 42, w: 7, d: 5, floors: 4 },
  { x: 70, z: 50, w: 4, d: 7, floors: 3 },
  { x: 25, z: 38, w: 5, d: 3, floors: 2 },
  { x: 48, z: 35, w: 3, d: 5, floors: 5 },
  { x: 72, z: 58, w: 6, d: 4, floors: 3 },
  { x: 58, z: 62, w: 4, d: 4, floors: 4 },
  { x: 38, z: 32, w: 5, d: 6, floors: 2 },
  { x: 80, z: 45, w: 5, d: 5, floors: 3 },
  { x: 28, z: 62, w: 4, d: 3, floors: 4 },
  { x: 62, z: 35, w: 3, d: 6, floors: 6 },
  { x: 52, z: 44, w: 2, d: 2, floors: 8 },
  { x: 54, z: 43, w: 3, d: 2, floors: 10 },
  { x: 51, z: 42, w: 2, d: 3, floors: 6 },
];

export function seedBuildings(): Building[] {
  return SEED_FOOTPRINTS.map((b) => ({ ...b, id: crypto.randomUUID() }));
}

export function buildBuildingGroup(b: Building): THREE.Group {
  const group = new THREE.Group();
  group.userData.buildingId = b.id;

  const h = b.floors * FLOOR_HEIGHT;
  const baseY = getHeight(b.x, b.z);

  const mat = new THREE.MeshStandardMaterial({
    color: theme.building,
    roughness: 0.6,
    metalness: 0.0,
  });

  const box = new THREE.Mesh(new THREE.BoxGeometry(b.w, h, b.d), mat);
  box.position.set(b.x, baseY + h / 2, b.z);
  box.castShadow = true;
  box.receiveShadow = true;
  box.userData.buildingId = b.id;
  box.userData.role = "mainBox";
  group.add(box);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.3, 0.2, b.d + 0.3), mat);
  roof.position.set(b.x, baseY + h + 0.1, b.z);
  roof.castShadow = true;
  roof.userData.buildingId = b.id;
  roof.userData.role = "roof";
  group.add(roof);

  const edgeMat = new THREE.LineBasicMaterial({ color: theme.edge });
  for (let f = 1; f < b.floors; f++) {
    const fy = baseY + f * FLOOR_HEIGHT;
    const hw = b.w / 2;
    const hd = b.d / 2;
    const pts = [
      new THREE.Vector3(b.x - hw, fy, b.z - hd),
      new THREE.Vector3(b.x + hw, fy, b.z - hd),
      new THREE.Vector3(b.x + hw, fy, b.z + hd),
      new THREE.Vector3(b.x - hw, fy, b.z + hd),
      new THREE.Vector3(b.x - hw, fy, b.z - hd),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(lineGeo, edgeMat));
  }

  return group;
}

export function disposeBuildingGroup(group: THREE.Group): void {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    } else if (obj instanceof THREE.Line) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
}

export function rebuildBuildingsGroup(
  parent: THREE.Group,
  buildings: Building[],
): void {
  for (let i = parent.children.length - 1; i >= 0; i--) {
    const child = parent.children[i];
    parent.remove(child);
    if (child instanceof THREE.Group) disposeBuildingGroup(child);
  }
  for (const b of buildings) {
    parent.add(buildBuildingGroup(b));
  }
}
