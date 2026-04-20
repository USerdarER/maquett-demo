import { useEffect, type Dispatch, type RefObject, type MutableRefObject } from "react";
import * as THREE from "three";
import type { EditAction, EditState } from "./useEditState";
import { pickBuildingId } from "./selection";
import { buildPreviewLoop, pickGroundPoint } from "./drawMode";

export type SceneInteractionRefs = {
  domElement: RefObject<HTMLElement | null>;
  camera: RefObject<THREE.PerspectiveCamera | null>;
  scene: RefObject<THREE.Scene | null>;
  buildingsGroup: RefObject<THREE.Group | null>;
  terrainMesh: RefObject<THREE.Mesh | null>;
  previewLine: MutableRefObject<THREE.Line | null>;
};

export function useSceneInteraction(
  refs: SceneInteractionRefs,
  ready: boolean,
  state: EditState,
  dispatch: Dispatch<EditAction>,
): void {
  useEffect(() => {
    if (!ready) return;
    const domElement = refs.domElement.current;
    const camera = refs.camera.current;
    const scene = refs.scene.current;
    const buildingsGroup = refs.buildingsGroup.current;
    const terrainMesh = refs.terrainMesh.current;
    if (!domElement || !camera || !scene || !buildingsGroup || !terrainMesh) return;

    const onClick = (ev: MouseEvent) => {
      if (ev.button !== 0) return;
      if (state.mode === "idle") {
        const id = pickBuildingId(ev, domElement, camera, buildingsGroup);
        if (id) dispatch({ type: "select", id });
        else if (state.selectedId !== null) dispatch({ type: "deselect" });
      } else if (state.mode === "draw") {
        const point = pickGroundPoint(ev, domElement, camera, terrainMesh);
        if (point) dispatch({ type: "addDrawPoint", point });
      }
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (state.mode !== "draw" || state.drawPoints.length !== 1) return;
      const point = pickGroundPoint(ev, domElement, camera, terrainMesh);
      if (!point) return;
      if (refs.previewLine.current) {
        scene.remove(refs.previewLine.current);
        refs.previewLine.current.geometry.dispose();
        refs.previewLine.current = null;
      }
      const line = buildPreviewLoop(state.drawPoints[0], point, 0.4);
      scene.add(line);
      refs.previewLine.current = line;
    };

    domElement.addEventListener("click", onClick);
    domElement.addEventListener("mousemove", onMouseMove);
    return () => {
      domElement.removeEventListener("click", onClick);
      domElement.removeEventListener("mousemove", onMouseMove);
    };
  }, [refs, ready, state, dispatch]);
}
