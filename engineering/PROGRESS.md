# Maquett Demo — Progress

Living tracker. Update weekly.

## Current phase: PHASE 1 — Editing prototype

**Goal:** Render a pre-generated 3D massing site (ported from `topo-model.jsx`) and let the user select, delete, and draw new buildings.

**Status:** Phase 1 complete (2026-04-20). Phase 1.5 hardening queued — see `ROADMAP.md` Steps 6–8.

---

## Phase 1 Completion Checklist

### Scaffold
- [x] Vite + React + TS scaffold under `engineering/`
- [x] Three.js + types installed
- [x] Folder skeleton created
- [x] Markdown docs written
- [x] `npm run dev` serves empty page cleanly

### Port reference
- [x] `scene/terrain.ts` — noise + getHeight + contours + terrain mesh
- [x] `scene/roads.ts`
- [x] `scene/buildings.ts`
- [x] `scene/lighting.ts`
- [x] `scene/cameraControls.ts`
- [x] `ui/widgets/Slider.tsx` + `Toggle.tsx`
- [x] `ui/SceneControls.tsx`
- [x] `scene/TopoModel.tsx`
- [x] `App.tsx` layout + state
- [x] Scene parity with reference

### Editing — selection
- [x] `useEditState` context + reducer
- [x] `selection.ts` raycaster + highlight
- [x] Click listener wired

### Editing — delete
- [x] `deleteSelected` reducer
- [x] `keybindings.ts` Delete/Backspace
- [x] `Toolbar.tsx` Delete button
- [x] Building group rebuild on state change

### Editing — draw
- [x] Draw-mode reducer actions
- [x] `drawMode.ts` ground pick + footprint
- [x] Toolbar Draw + floor-count input
- [x] Click handler branches on mode
- [x] Ghost preview
- [x] `DrawHint.tsx`

### Polish
- [x] Escape cancels + clears
- [x] Cursor hints
- [x] Floor validation
- [x] Empty state
- [x] `type-check` + `build` pass

---

## Blockers
None.

## Milestones

| Milestone | Target | Status |
|---|---|---|
| Scaffold + docs | Session 1 | ✅ |
| Reference ported | Session 1 | ✅ |
| Select/delete working | Session 1 | ✅ |
| Draw-new-building working | Session 1 | ✅ |
| Polish + type-check clean | Session 1 | ✅ |
| Engineering audit | 2026-04-20 | ✅ |
| Phase 1.5 Step 6 — material cache | 2026-04-20 | ✅ |
| Phase 1.5 Step 7 — scene-interaction hook | 2026-04-20 | ✅ |
| Phase 1.5 Step 8 — preview disposal | 2026-04-20 | ✅ |

## Weekly Snapshots

### Week 1 (2026-04-19 → 2026-04-20)
**Planned:** everything above (one-session prototype).
**Built:** Phase 1 Steps 0–5 shipped end-to-end. Scene parity with reference, select/delete, two-click draw with floor count, polish.
**Learnings:**
- Reducer + `stateRef` bridge to raw-Three click handlers works but reads as a footgun for newcomers. Extracting a `useSceneInteraction` hook is the right next move.
- Per-building material clones were cheap to ship but hide lifecycle risk (shared `selectedMat` + no disposal on unmount). Centralizing via ref-counted cache keeps future highlight effects open.
- Preview line material survives cleanup — easy miss, easy fix.
- Docs/code consistency held up well across the session; `DECISIONS.md` ADRs captured every non-trivial fork.

**Next:** Phase 1.5 hardening (ROADMAP Steps 6–8), then decide Phase 2 direction.

### Week 2 (2026-04-20 →)
**Planned:** Phase 1.5 — material cache, scene-interaction hook, preview disposal.
**Built:** (update at session end).
**Learnings:** (fill in).
**Next:** pick first Phase 2 candidate.

---

## Phase 1 Definition of Done

1. Scene renders terrain, contours, roads, seed buildings.
2. Visibility toggles + sun sliders work.
3. Orbit / pan / zoom camera works.
4. Click a building → highlight. Click ground → clear.
5. Selected building can be deleted via keyboard or toolbar.
6. Draw mode places a new building with specified floor count at two-click corners.
7. `npm run type-check` clean; `npm run build` succeeds.

## Notes for next phase

Leave empty until Phase 1 ships. Likely candidates: image upload → terrain generation, AI edit assistant, export.
