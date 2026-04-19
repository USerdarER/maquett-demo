import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { theme } from "../theme";
import { buildBasePlatform, buildContourGroup, buildTerrainMesh } from "./terrain";
import { buildRoadGroup } from "./roads";
import { rebuildBuildingsGroup } from "./buildings";
import { createLights, updateSun } from "./lighting";
import { attachCameraControls, type CameraControlsHandle, type CameraRefs } from "./cameraControls";
import { useEditState } from "../editing/useEditState";
import { applySelectionHighlight, pickBuildingId } from "../editing/selection";
import { buildPreviewLoop, pickGroundPoint } from "../editing/drawMode";
import { DrawHint } from "../ui/DrawHint";

type Props = {
  showBuildings: boolean;
  showRoads: boolean;
  showContours: boolean;
  lightAngle: number;
  lightElevation: number;
};

export function TopoModel({
  showBuildings,
  showRoads,
  showContours,
  lightAngle,
  lightElevation,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const buildingsGroupRef = useRef<THREE.Group | null>(null);
  const roadsGroupRef = useRef<THREE.Group | null>(null);
  const contoursGroupRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const previewLineRef = useRef<THREE.Line | null>(null);
  const controlsRef = useRef<CameraControlsHandle | null>(null);
  const frameRef = useRef<number | null>(null);

  const { state, dispatch } = useEditState();
  const stateRef = useRef(state);
  stateRef.current = state;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(theme.sceneClear);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(theme.sceneFog, 150, 300);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 500);
    cameraRef.current = camera;

    const { ambient, dirLight, fillLight } = createLights();
    scene.add(ambient);
    scene.add(dirLight);
    scene.add(fillLight);
    dirLightRef.current = dirLight;

    scene.add(buildBasePlatform());

    const terrain = buildTerrainMesh();
    scene.add(terrain);
    terrainMeshRef.current = terrain;

    const contours = buildContourGroup();
    scene.add(contours);
    contoursGroupRef.current = contours;

    const roads = buildRoadGroup();
    scene.add(roads);
    roadsGroupRef.current = roads;

    const buildings = new THREE.Group();
    scene.add(buildings);
    buildingsGroupRef.current = buildings;
    rebuildBuildingsGroup(buildings, stateRef.current.buildings);
    applySelectionHighlight(buildings, stateRef.current.selectedId);

    const camRefs: CameraRefs = {
      theta: Math.PI / 5,
      phi: Math.PI / 5.5,
      dist: 90,
      target: new THREE.Vector3(50, 0, 50),
    };
    const controls = attachCameraControls(renderer.domElement, camera, camRefs);
    controls.updateCamera();
    controlsRef.current = controls;

    updateSun(dirLight, 45, 55);
    setReady(true);

    const onClick = (ev: MouseEvent) => {
      if (ev.button !== 0) return;
      const current = stateRef.current;
      if (current.mode === "idle") {
        const id = pickBuildingId(ev, renderer.domElement, camera, buildings);
        if (id) dispatch({ type: "select", id });
        else if (current.selectedId !== null) dispatch({ type: "deselect" });
      } else if (current.mode === "draw") {
        if (!terrainMeshRef.current) return;
        const point = pickGroundPoint(ev, renderer.domElement, camera, terrainMeshRef.current);
        if (point) dispatch({ type: "addDrawPoint", point });
      }
    };

    const onMouseMove = (ev: MouseEvent) => {
      const current = stateRef.current;
      if (current.mode !== "draw" || current.drawPoints.length !== 1) return;
      if (!terrainMeshRef.current) return;
      const point = pickGroundPoint(ev, renderer.domElement, camera, terrainMeshRef.current);
      if (!point) return;
      if (previewLineRef.current) {
        scene.remove(previewLineRef.current);
        previewLineRef.current.geometry.dispose();
        previewLineRef.current = null;
      }
      const line = buildPreviewLoop(current.drawPoints[0], point, 0.4);
      scene.add(line);
      previewLineRef.current = line;
    };

    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      controls.dispose();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [dispatch]);

  useEffect(() => {
    if (buildingsGroupRef.current) buildingsGroupRef.current.visible = showBuildings;
  }, [showBuildings]);

  useEffect(() => {
    if (roadsGroupRef.current) roadsGroupRef.current.visible = showRoads;
  }, [showRoads]);

  useEffect(() => {
    if (contoursGroupRef.current) contoursGroupRef.current.visible = showContours;
  }, [showContours]);

  useEffect(() => {
    if (dirLightRef.current) updateSun(dirLightRef.current, lightAngle, lightElevation);
  }, [lightAngle, lightElevation]);

  useEffect(() => {
    if (!buildingsGroupRef.current) return;
    rebuildBuildingsGroup(buildingsGroupRef.current, state.buildings);
    buildingsGroupRef.current.visible = showBuildings;
    applySelectionHighlight(buildingsGroupRef.current, state.selectedId);
  }, [state.buildings, showBuildings, state.selectedId]);

  useEffect(() => {
    if (!buildingsGroupRef.current) return;
    applySelectionHighlight(buildingsGroupRef.current, state.selectedId);
  }, [state.selectedId]);

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.setCursor(state.mode === "draw" ? "crosshair" : "grab");
  }, [state.mode]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (state.mode !== "draw" || state.drawPoints.length === 0) {
      if (previewLineRef.current) {
        scene.remove(previewLineRef.current);
        previewLineRef.current.geometry.dispose();
        previewLineRef.current = null;
      }
    }
  }, [state.mode, state.drawPoints]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "rgba(35,35,48,0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          padding: "8px 14px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 60, height: 2, background: theme.accentHi, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: -3, width: 1, height: 8, background: theme.accentHi }} />
            <div style={{ position: "absolute", right: 0, top: -3, width: 1, height: 8, background: theme.accentHi }} />
          </div>
          <span style={{ fontSize: 9, color: theme.dim, fontFamily: theme.mono }}>~10m</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(35,35,48,0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          padding: "10px 12px",
          border: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 9, color: theme.warmAccent, fontFamily: theme.mono, fontWeight: 700 }}>N</span>
        <span style={{ fontSize: 14, color: theme.accentHi, lineHeight: 1 }}>↑</span>
      </div>

      {state.mode === "draw" && <DrawHint pointsPlaced={state.drawPoints.length} />}

      {state.buildings.length === 0 && state.mode === "idle" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: theme.dim,
            fontFamily: theme.mono,
            fontSize: 12,
            letterSpacing: 2,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          NO BUILDINGS
          <br />
          <span style={{ fontSize: 10 }}>Use Draw to add one</span>
        </div>
      )}

      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.bg,
            zIndex: 10,
          }}
        >
          <div style={{ color: theme.dim, fontFamily: theme.mono, fontSize: 12, letterSpacing: 2 }}>
            GENERATING TERRAIN...
          </div>
        </div>
      )}
    </div>
  );
}
