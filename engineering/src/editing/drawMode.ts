import * as THREE from "three";
import { theme } from "../theme";
import type { Vec2 } from "./useEditState";

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

export function pickGroundPoint(
  event: MouseEvent,
  domEl: HTMLElement,
  camera: THREE.Camera,
  terrainMesh: THREE.Mesh,
): Vec2 | null {
  const rect = domEl.getBoundingClientRect();
  ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObject(terrainMesh, false);
  if (hits.length === 0) return null;
  const p = hits[0].point;
  return [p.x, p.z];
}

export function buildFootprintFromTwoPoints(p1: Vec2, p2: Vec2): { x: number; z: number; w: number; d: number } {
  return {
    x: (p1[0] + p2[0]) / 2,
    z: (p1[1] + p2[1]) / 2,
    w: Math.max(0.5, Math.abs(p1[0] - p2[0])),
    d: Math.max(0.5, Math.abs(p1[1] - p2[1])),
  };
}

const previewMat = new THREE.LineBasicMaterial({ color: theme.warmAccent });

export function buildPreviewLoop(p1: Vec2, p2: Vec2, yOffset: number): THREE.Line {
  const [x, z, w, d] = [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2,
    Math.abs(p1[0] - p2[0]),
    Math.abs(p1[1] - p2[1]),
  ];
  const hw = w / 2;
  const hd = d / 2;
  const pts = [
    new THREE.Vector3(x - hw, yOffset, z - hd),
    new THREE.Vector3(x + hw, yOffset, z - hd),
    new THREE.Vector3(x + hw, yOffset, z + hd),
    new THREE.Vector3(x - hw, yOffset, z + hd),
    new THREE.Vector3(x - hw, yOffset, z - hd),
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.Line(geo, previewMat);
}

export function disposePreview(line: THREE.Line | null): void {
  if (!line) return;
  line.geometry.dispose();
}
