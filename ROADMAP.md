# Maquett Demo — Roadmap

A single ordered checklist you can work down linearly. Each step ends with something runnable.

---

## Step 0 — Scaffold
- [x] `cd engineering && npm create vite@latest . -- --template react-ts`
- [x] `npm install three && npm install -D @types/three`
- [x] Remove Vite boilerplate (`App.css`, default `App.tsx` body, demo assets).
- [x] Create folder skeleton: `src/scene/`, `src/editing/`, `src/ui/widgets/`, `docs/PHASE_1/`.
- [x] Write all Markdown docs (this file, CLAUDE, README, PROGRESS, DECISIONS, SPEC).
- [x] `npm run dev` serves a blank page with no console errors.

## Step 1 — Port `topo-model.jsx` into modules
- [x] `src/scene/terrain.ts` — noise, `getHeight`, contour lines, terrain mesh.
- [x] `src/scene/roads.ts` — road paths + segment meshes.
- [x] `src/scene/buildings.ts` — `Building` type, seed list, `buildBuildingMesh`.
- [x] `src/scene/lighting.ts` — lights + sun updater.
- [x] `src/scene/cameraControls.ts` — mouse/touch/wheel orbit/pan/zoom.
- [x] `src/ui/widgets/Slider.tsx` + `Toggle.tsx`.
- [x] `src/ui/SceneControls.tsx` — left rail (toggles, sun sliders, legend).
- [x] `src/scene/TopoModel.tsx` — renderer/scene mount + animation + cleanup + overlays.
- [x] `src/App.tsx` — layout shell + visibility/sun state.
- [x] Scene matches reference: terrain, contours, roads, buildings, toggles, sun, camera.

## Step 2 — Building selection
- [x] `src/editing/useEditState.ts` — context/reducer with `select` + `deselect`.
- [x] `src/editing/selection.ts` — `pickBuilding` (raycaster) + `applySelectionHighlight`.
- [x] Wire click listener in `TopoModel.tsx`.
- [x] Clicking a building highlights it; clicking ground clears.

## Step 3 — Delete selected building
- [x] `deleteSelected` reducer.
- [x] `src/editing/keybindings.ts` — Delete/Backspace handler.
- [x] `src/ui/Toolbar.tsx` — Select / Draw / Delete buttons.
- [x] `useEffect([buildings])` in `TopoModel.tsx` rebuilds building group.
- [x] Delete key removes selected building; toolbar Delete works; no orphan lines.

## Step 4 — Draw new building
- [x] Extend reducer: `enterDrawMode`, `cancelDraw`, `addDrawPoint`, `setFloorCount`, `commitBuilding`.
- [x] `src/editing/drawMode.ts` — `pickGroundPoint` + `buildFootprintFromTwoPoints`.
- [x] Toolbar: Draw button + floor-count input.
- [x] `TopoModel.tsx` click handler branches on mode.
- [x] Ghost preview between first and second click.
- [x] `src/ui/DrawHint.tsx` — contextual hint.
- [x] Two clicks → new building at correct terrain height with specified floors.

## Step 5 — Polish
- [x] Escape cancels draw + clears selection.
- [x] Cursor hints: grab / grabbing / crosshair.
- [x] Toolbar shows selected-building summary.
- [x] Floor input validates 1–20.
- [x] Empty-state hint when no buildings.
- [x] `npm run type-check` clean; `npm run build` succeeds.

---

## Verification flow

Run after Step 5:

```bash
cd engineering && npm run dev    # http://localhost:5173
```

1. Parity: terrain + contours + 3 roads + 21 seed buildings render.
2. Toggles + sun sliders work.
3. Left-drag orbits, right-drag pans, wheel zooms.
4. Click a building → highlight. Click ground → clear.
5. Select → Delete key or toolbar Delete → building disappears.
6. Draw → 2 clicks → new building appears at correct terrain height.
7. Esc cancels mid-draw.
8. `npm run type-check` clean; `npm run build` succeeds.
