# Maquett Demo — Engineering

Rules for any agent touching this codebase.

## Scope
This is a **prototype** of the editing experience, not production code. The goal is to prove the UX of select / delete / draw on a pre-generated 3D massing model. Upload, export, and AI are out of scope — flag a requester if they ask.

## Tech stack
| Layer | Choice |
|---|---|
| Bundler | Vite 8 |
| UI | React 19 + hooks |
| Language | TypeScript (strict) |
| 3D | Three.js 0.184 (raw — no React Three Fiber) |
| Styling | Inline styles (ported from reference) |
| Lint | ESLint (Vite default) |

## Conventions
- **Files:** camelCase for utilities (`terrain.ts`), PascalCase for React components (`TopoModel.tsx`), UPPERCASE for always-read docs (`CLAUDE.md`).
- **Single source of truth for buildings:** `useEditState`. When `buildings` changes, `TopoModel.tsx` rebuilds the `buildingGroup` — the renderer, camera, terrain, and roads do NOT rebuild.
- **Scene code is not React.** `src/scene/*.ts` modules are pure geometry builders. `TopoModel.tsx` is the React glue around them.
- **Per-building material clone.** Each building owns its own `MeshStandardMaterial` so selection highlight is a cheap `mesh.material = selectedMat` swap.
- **Raycasting identity.** Each top-level building mesh carries `userData.buildingId`.
- **English only** in code, comments, and docs.

## Folder map
```
src/
├── main.tsx               # React root
├── App.tsx                # Layout shell, providers, state
├── index.css              # Body reset
├── theme.ts               # Color tokens
├── scene/                 # Three.js geometry + render loop
│   ├── TopoModel.tsx
│   ├── terrain.ts
│   ├── buildings.ts
│   ├── roads.ts
│   ├── cameraControls.ts
│   └── lighting.ts
├── editing/               # Edit-mode state + raycasting
│   ├── useEditState.ts
│   ├── selection.ts
│   ├── drawMode.ts
│   └── keybindings.ts
└── ui/                    # React UI
    ├── SceneControls.tsx
    ├── Toolbar.tsx
    ├── DrawHint.tsx
    └── widgets/
        ├── Slider.tsx
        └── Toggle.tsx
```

## Commands
```bash
npm run dev           # Dev server (http://localhost:5173)
npm run build         # Production build (tsc + vite build)
npm run type-check    # TypeScript only
npm run lint          # ESLint
npm run preview       # Serve built bundle
```

## Non-negotiables
- No hardcoded secrets.
- Spec before work — see `docs/PHASE_1/SPEC.md` before adding features.
- Decisions get logged — see `DECISIONS.md`.
- PROGRESS.md gets updated weekly.
