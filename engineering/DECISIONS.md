# Maquett Demo — Decisions

Architecture decisions, captured as they happen. Format: what, why, alternatives, status, date.

---

## ADR-001 — Vite over Next.js

**Decision:** Scaffold with Vite + React + TypeScript.

**Why:** Fastest prototype scaffold. HMR survives Three.js scene edits well. No SSR needed for a client-side 3D tool.

**Alternatives considered:**
- **Next.js** — heavier scaffold; SSR is irrelevant here; matches sibling `maquett/engineering/` but this prototype is a separate track.
- **CRA** — deprecated.
- **Plain HTML + importmaps** — matches `maquett/demo/` PoC style; fine for a throwaway sketch but gets unwieldy once selection + draw state grows.

**Status:** Accepted. 2026-04-19.

---

## ADR-002 — Raw Three.js over React Three Fiber

**Decision:** Use raw Three.js inside a React component, not React Three Fiber (R3F).

**Why:** The reference (`~/Downloads/topo-model.jsx`) is raw Three.js with a working custom orbit/pan/zoom control scheme. Porting to R3F would force rewriting the render loop, camera controls, and every geometry factory. Raw Three.js keeps the port a direct translation.

**Alternatives considered:**
- **R3F** — more ergonomic for declarative scenes, but custom camera controls and imperative raycasting (for building selection) become more awkward, not less.

**Status:** Accepted. 2026-04-19.

---

## ADR-003 — Inline styles over Tailwind / CSS modules

**Decision:** Ship the UI with inline styles, matching the reference.

**Why:** The reference already has a complete visual language in inline styles (palette, typography, spacing). Adding Tailwind or CSS modules would cost configuration and add no clarity at this scale. Palette tokens are extracted to `src/theme.ts` so toolbar + sidebar + highlight share them.

**Alternatives considered:**
- **Tailwind** — extra config; would require re-expressing a working design.
- **CSS modules / PostCSS** — more ceremony than benefit at this size.

**Status:** Accepted. 2026-04-19.

---

## ADR-004 — Procedural terrain, no Mapbox

**Decision:** This prototype uses only the procedural noise terrain from the reference. No Mapbox, no real elevation data.

**Why:** The scope of this prototype is the **editing experience**, not terrain loading. Real terrain lives in the sibling `~/OMC/maquett/engineering/` track. Keeping procedural here means no API keys, no network dependency, no flaky first-paint.

**Alternatives considered:**
- **Mapbox Terrain-RGB** — belongs in the sibling track.
- **Static heightmap image** — unnecessary complexity for a prototype; the procedural noise reads fine.

**Status:** Accepted. 2026-04-19. Revisit if the prototype graduates to a full app.

---

## ADR-005 — Axis-aligned rectangle for v1 draw mode

**Decision:** New buildings are drawn as axis-aligned rectangles via two clicks (first corner, opposite corner).

**Why:** Matches seed-building shape; simplest `Building` data model (`{x, z, w, d, floors}`); no convex/self-intersection handling; footprint aligns with terrain conformance already tested in seeds.

**Alternatives considered:**
- **Polygonal (N clicks + Enter)** — changes data model, needs self-intersection checks, out of prototype scope.
- **Rotated rectangle (two clicks + drag to rotate)** — adds a third interaction step; defer until a user asks.

**Status:** Accepted. 2026-04-19. Polygonal is a candidate for Phase 2.

---

## ADR-006 — Selection highlight via per-building material swap

**Decision:** Each building owns its own cloned `MeshStandardMaterial`. Selection is expressed by swapping that mesh's material to a shared warm-accent `MeshStandardMaterial`, and restoring on deselect.

**Why:** Cheapest possible highlight — no post-processing pipeline, no outline pass, no stencil tricks. Fits <30 buildings comfortably.

**Alternatives considered:**
- **OutlinePass (post-processing)** — better-looking but costs `EffectComposer` wiring and a render-target. Flag as an iteration if the swap reads poorly.
- **Emissive tint** — less visible than a full color swap under the current dark palette.

**Status:** Accepted. 2026-04-19.

---

## ADR-007 — Single-level undo is out of scope

**Decision:** No undo history in the prototype. Delete is final (until the next session).

**Why:** Adding a proper undo stack requires a command-pattern reducer or immer snapshots. Keep the prototype small; users can re-draw what they deleted.

**Alternatives considered:**
- **Single-level undo** — tempting, but adds UI surface (toolbar button + shortcut + confusion when user expects multi-level).

**Status:** Accepted. 2026-04-19. Add in Phase 2 if users ask.

---

## ADR-008 — Centralize material lifecycle behind a ref-counted cache

**Decision:** In Phase 1.5, route all `MeshStandardMaterial` creation for buildings and selection through a small ref-counted cache keyed by role. Scene builders acquire; `dispose*` helpers release.

**Why:** The Phase 1 shortcut — module-level `selectedMat` + `defaultMat` in `editing/selection.ts` and per-building inline construction in `scene/buildings.ts` — works for ≤30 buildings but (a) never disposes on unmount, (b) makes per-building highlight variants impossible (swap is global-by-reference), and (c) risks double-dispose once any pooling sneaks in. Multi-select, glow, and undo all push against this. Fix before Phase 2.

**Alternatives considered:**
- **Leave it** — acceptable only if Phase 2 never touches selection visuals. Unlikely.
- **Clone-per-render** — eliminates pooling concerns but regresses perf and still leaks without explicit disposal.
- **Move to R3F `<meshStandardMaterial />`** — reopens ADR-002; too big a change for the problem.

**Status:** Accepted. 2026-04-20. Implementation tracked as ROADMAP Step 6.

---

## ADR-009 — Extract scene interaction into a dedicated hook

**Decision:** Move `onClick` / `onMouseMove` handlers out of `scene/TopoModel.tsx` into a `useSceneInteraction(sceneRef, state, dispatch)` hook. Remove the `stateRef.current` escape hatch.

**Why:** Today's click handlers close over `stateRef.current` because they are bound once during scene setup. It works, but every future tool mode (resize, rotate, multi-select) inherits the stale-closure pattern and the obligation to remember it. A hook with `[state, dispatch]` deps re-binds correctly and keeps `TopoModel.tsx` focused on renderer/scene lifecycle.

**Alternatives considered:**
- **Keep `stateRef`** — zero churn, but the pattern compounds as modes grow.
- **Event bus / observer** — overkill at this scale; adds indirection without solving the closure problem directly.

**Status:** Accepted. 2026-04-20. Implementation tracked as ROADMAP Step 7.
