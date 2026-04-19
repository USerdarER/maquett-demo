# Maquett Demo — Engineering

Vite + React 19 + TypeScript + Three.js prototype of the Maquett editing experience.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on `http://localhost:5173` |
| `npm run build` | Production build (runs `tsc -b` then `vite build`) |
| `npm run type-check` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the built bundle for verification |

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Bundler | Vite 8 | Fastest prototype scaffold, HMR |
| UI | React 19 + hooks | Matches reference; smallest translation cost |
| Language | TypeScript strict | Catches mode/selection/draw-state bugs |
| 3D | Three.js 0.184 (raw) | Reference uses raw Three.js; R3F would force a rewrite |
| Styling | Inline styles | Reference already has a complete inline visual language |

See `DECISIONS.md` for the reasoning behind each choice.

## Folder map

```
src/
├── main.tsx               # React root
├── App.tsx                # Layout shell + state
├── theme.ts               # Color tokens
├── scene/                 # Three.js geometry + render loop
├── editing/               # Edit-mode state, raycasting, keybindings
└── ui/                    # React UI (sidebar, toolbar, widgets)
```

## Current phase

**Phase 1 — Editing prototype.** Select, delete, and draw-new-building on procedural terrain.

- Current status: see `PROGRESS.md`.
- Feature spec: see `docs/PHASE_1/SPEC.md`.
- Architecture decisions: see `DECISIONS.md`.

## Roadmap (project-level)

See `../ROADMAP.md` for the step-by-step build checklist.
