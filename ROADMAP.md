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

---

## Phase 1.5 — Hardening (post-audit, 2026-04-20)

Prototype shipped. Engineering audit surfaced three items to address before Phase 2 features (multi-select, undo, export) land. Each is small and ordered by leverage.

### Step 6 — Centralize material lifecycle
- [x] Introduce a ref-counted material cache keyed by role (`default`, `selected`). `preview` deferred to Step 8 (LineBasicMaterial).
- [x] `buildBuildingGroup` acquires from the cache instead of constructing `MeshStandardMaterial` inline (`scene/buildings.ts`).
- [x] `disposeBuildingGroup` releases by role via ref count (`scene/buildings.ts`).
- [x] `applySelectionHighlight` transitions roles via acquire/release; module-level singletons removed (`editing/selection.ts`).
- [x] Unmount cleanup in `TopoModel.tsx` disposes the building group so cache counts settle to zero.
- [x] `type-check` + `build` clean.

**Why first:** fixes the root fragility that blocks per-building highlight effects (glow, multi-select colors) and eliminates double-dispose risk.

### Step 7 — Stabilize scene event handlers
- [x] Extract click + mousemove handlers from `TopoModel.tsx` into a `useSceneInteraction(refs, ready, state, dispatch)` hook (`editing/useSceneInteraction.ts`).
- [x] Remove the `stateRef.current` escape hatch.
- [x] Handler closures depend on `[state, dispatch]`; re-bind on change. `ready` gates setup until scene refs populate.
- [x] `type-check` + `build` clean.

**Why:** the stale-closure pattern works today but is a footgun for anyone adding a new tool mode.

### Step 8 — Tighten preview disposal
- [ ] `disposePreview` also calls `line.material.dispose()` (`scene/TopoModel.tsx:131`).
- [ ] Unmount cleanup covers the preview line path (`scene/TopoModel.tsx:207`).

**Why:** hygiene; pairs naturally with Step 6.

### Housekeeping (not coding)
- [ ] Reconcile `PROGRESS.md` milestones (all ✅).
- [ ] Prune stale worktree `.claude/worktrees/hardcore-mendeleev-1c624f/` after confirming no in-flight work there.

---

## Phase 2 candidates (not scheduled)

Surfaced by audit + original scope doc. Pick from here once Phase 1.5 lands.

- Multi-select (shift-click, marquee).
- Undo stack (command-pattern reducer).
- Edit existing building (resize, move, floor count).
- Polygonal / rotated footprints.
- Image upload → terrain generation (joins the sibling Mapbox track).
- Export (OBJ / STL / DXF / PNG).
- AI edit assistant.
- TS path aliases (`@/scene`, `@/editing`) once import depth hurts.
