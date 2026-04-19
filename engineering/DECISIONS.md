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
