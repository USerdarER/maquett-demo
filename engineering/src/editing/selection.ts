import * as THREE from "three";
import { acquireMaterial, releaseMaterial, type MatRole } from "../scene/materialCache";

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

export function pickBuildingId(
  event: MouseEvent,
  domEl: HTMLElement,
  camera: THREE.Camera,
  buildingsGroup: THREE.Group,
): string | null {
  const rect = domEl.getBoundingClientRect();
  ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(buildingsGroup.children, true);
  for (const hit of hits) {
    let obj: THREE.Object3D | null = hit.object;
    while (obj) {
      if (obj.userData && typeof obj.userData.buildingId === "string") {
        return obj.userData.buildingId as string;
      }
      obj = obj.parent;
    }
  }
  return null;
}

export function applySelectionHighlight(
  buildingsGroup: THREE.Group,
  selectedId: string | null,
): void {
  for (const child of buildingsGroup.children) {
    if (!(child instanceof THREE.Group)) continue;
    const id = child.userData.buildingId as string | undefined;
    const isSelected = id !== undefined && id === selectedId;
    const newRole: MatRole = isSelected ? "selected" : "default";
    const oldRole = child.userData.materialRole as MatRole | undefined;
    if (oldRole === newRole) continue;

    const newMat = acquireMaterial(newRole);
    if (oldRole) releaseMaterial(oldRole);
    child.userData.materialRole = newRole;

    for (const part of child.children) {
      if (
        part instanceof THREE.Mesh &&
        (part.userData.role === "mainBox" || part.userData.role === "roof")
      ) {
        part.material = newMat;
      }
    }
  }
}
