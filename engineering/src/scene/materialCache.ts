import * as THREE from "three";
import { theme } from "../theme";

export type MatRole = "default" | "selected";

type Entry = { material: THREE.MeshStandardMaterial; count: number };

const cache = new Map<MatRole, Entry>();

function create(role: MatRole): THREE.MeshStandardMaterial {
  switch (role) {
    case "default":
      return new THREE.MeshStandardMaterial({
        color: theme.building,
        roughness: 0.6,
        metalness: 0.0,
      });
    case "selected":
      return new THREE.MeshStandardMaterial({
        color: theme.buildingSelected,
        roughness: 0.5,
        metalness: 0.0,
      });
  }
}

export function acquireMaterial(role: MatRole): THREE.MeshStandardMaterial {
  const existing = cache.get(role);
  if (existing) {
    existing.count++;
    return existing.material;
  }
  const entry: Entry = { material: create(role), count: 1 };
  cache.set(role, entry);
  return entry.material;
}

export function releaseMaterial(role: MatRole): void {
  const entry = cache.get(role);
  if (!entry) return;
  entry.count--;
  if (entry.count <= 0) {
    entry.material.dispose();
    cache.delete(role);
  }
}

export function disposeAllMaterials(): void {
  for (const entry of cache.values()) entry.material.dispose();
  cache.clear();
}
