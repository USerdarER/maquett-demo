# Phase 1 — Editing Prototype — SPEC

Detailed spec for the prototype's edit features. Read before implementing any of Steps 2–5.

---

## Non-goals
Upload, export, AI assist, polygonal footprints, rotated footprints, multi-select, edit-existing, terrain edits, persistence, undo history, Mapbox.

## Data model

```ts
type Vec2 = [number, number];            // [x, z] on the ground plane
type Building = {
  id: string;                            // crypto.randomUUID()
  x: number;                             // center x (world units)
  z: number;                             // center z (world units)
  w: number;                             // width (x extent)
  d: number;                             // depth (z extent)
  floors: number;                        // integer, 1..20
};

type EditMode = 'idle' | 'draw';

type EditState = {
  mode: EditMode;
  selectedId: string | null;
  buildings: Building[];
  drawPoints: Vec2[];                    // 0 or 1 point when mid-draw
  floorCount: number;                    // default 3
};
```

## Reducer actions

- `select(id)` — sets `selectedId`. Ignored in `draw` mode.
- `deselect()` — clears `selectedId`.
- `deleteSelected()` — removes the building whose `id === selectedId`, clears selection.
- `enterDrawMode()` — sets `mode='draw'`, clears selection, resets `drawPoints`.
- `cancelDraw()` — sets `mode='idle'`, clears `drawPoints`.
- `addDrawPoint(v2)` — appends to `drawPoints`. When length reaches 2, reducer also commits the building (`drawPoints` cleared, `mode='idle'`).
- `setFloorCount(n)` — clamped to 1..20.
- `commitBuilding(b)` — appends to `buildings`. Used internally by the reducer above.

## Scene pipeline (unchanged from reference)

1. Base platform (120×2×120 Box).
2. Terrain: `PlaneGeometry(100, 100, 200, 200)` with Y displaced via `getHeight(x,z)`.
3. Contour lines at 1m intervals via grid-cell edge interpolation.
4. Three procedurally-swept roads as chained Box segments lying on the terrain.
5. Buildings: `BoxGeometry(w, h, d)` centered at `(x, base + h/2, z)` where `base = getHeight(x, z)` and `h = floors * 3.2`. Plus a thin roof slab and floor-line Lines every 3.2m.
6. Sun via `DirectionalLight`; fill via second `DirectionalLight`; ambient.

## Selection

### Behavior
- In `idle` mode, a left-click on a building mesh selects it.
- Clicking empty ground (or missing a building) deselects.
- Visual: selected building's main box material swaps to the warm-accent material (`theme.warmAccent`). Floor lines and roof slab remain unchanged.
- Only one building is selected at a time.
- Selection is cleared when entering draw mode and when deleting.

### Implementation
- Each building owns a cloned `MeshStandardMaterial` (per-building) so the swap is reversible.
- Click handler converts pointer to NDC, raycasts against `buildingGroup.children`, traverses up to find a group whose `userData.buildingId` is set.
- `applySelectionHighlight(group, selectedId)` iterates groups and sets `mainMesh.material = selectedId === b.id ? selectedMat : b.material`.

## Delete

### Behavior
- **Delete key** or **Backspace key** when a building is selected → removes it.
- **Toolbar Delete button** → same action; disabled when nothing is selected.
- After delete, selection is cleared.
- Keyboard delete is ignored when focus is on an `<input>` or `<textarea>`.

### Implementation
- `deleteSelected` reducer removes from `buildings` array by id.
- `TopoModel` has `useEffect([buildings])` that disposes every child group (geometry + material) of `buildingGroup` and rebuilds from the current list via `buildBuildingMesh`.
- Visibility flag (`showBuildings`) is re-applied to the rebuilt group.

## Draw new building

### Behavior
- **Toolbar Draw button** → enters `mode='draw'`. Cursor becomes crosshair. Clears selection.
- Toolbar exposes a numeric input for `floorCount` (default 3, range 1..20).
- **First click on the ground** → records first corner. Hint updates to "Click opposite corner".
- **Mouse move** (with 1 point recorded) → renders a ghost footprint preview: a `LineLoop` rectangle between the first point and the current ground pick.
- **Second click on the ground** → commits the building:
  - Footprint is axis-aligned: center = midpoint; width = |Δx|; depth = |Δz|.
  - Building is built via the same `buildBuildingMesh` as seeds → automatic terrain conformance.
  - Reducer returns to `mode='idle'`, ghost preview removed.
- **Esc** → cancels draw and clears points. Ignored outside draw mode.
- **Click that misses terrain** (e.g. hits sky) → no point recorded; hint unchanged.

### Implementation
- `pickGroundPoint(event, camera, terrainMesh)` raycasts only against the terrain mesh; returns `THREE.Vector3 | null`.
- `buildFootprintFromTwoPoints(p1, p2)` returns `{x, z, w, d}` with `w = max(0.5, |p1.x - p2.x|)` and `d = max(0.5, |p1.z - p2.z|)` (enforces minimum 0.5m so degenerate rectangles don't sneak in).
- `TopoModel`'s click handler branches on `state.mode`:
  - `idle` → selection logic.
  - `draw` → pick ground and dispatch `addDrawPoint`.
- Ghost preview: on `mousemove` in draw mode with `drawPoints.length === 1`, recompute and render a `LineLoop` of the preview rectangle. Preview group is disposed on commit, cancel, or when `drawPoints.length` leaves 1.

## Keybindings

| Key | Action | Condition |
|---|---|---|
| Delete | deleteSelected | `selectedId !== null`, focus not in input |
| Backspace | deleteSelected | `selectedId !== null`, focus not in input |
| Escape | cancelDraw + deselect | always |

## Toolbar

| Control | Visible when | Enabled when | Action |
|---|---|---|---|
| Select (mode indicator) | always | always | `cancelDraw(); deselect()` if currently active |
| Draw | always | always | `enterDrawMode()` |
| Floors input | `mode === 'draw'` | always | `setFloorCount(n)` |
| Delete | always | `selectedId !== null` | `deleteSelected()` |

## Acceptance criteria (must pass before phase closes)

1. Scene parity with reference: terrain + contours + 3 roads + 21 seed buildings; visibility toggles work; sun sliders work; camera orbit/pan/zoom works.
2. Click a building → warm-accent highlight. Click ground → clears. Click another building → highlight moves.
3. Delete key removes selected building; toolbar Delete does the same; no orphan floor lines.
4. Draw: toolbar Draw → crosshair; set floors = 3; two clicks near center → new 3-story building at correct terrain height; visually matches a seed-3-story nearby.
5. Esc mid-draw cancels cleanly (cursor reverts, no ghost residue).
6. `npm run type-check` clean; `npm run build` succeeds.
