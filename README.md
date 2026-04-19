# Maquett Demo

A prototype of the Maquett editing experience for architecture students.

Renders a pre-generated 3D site (terrain, contours, roads, buildings), and lets the user select, delete, and draw new buildings. Upload, export, and AI features are out of scope for this prototype.

---

## Quick start

```bash
cd engineering
npm install
npm run dev
# open http://localhost:5173
```

See `engineering/README.md` for build commands, tech stack, and folder map.

## Roadmap

The delivery is broken into five ordered steps — see `ROADMAP.md`.

## Documentation

- `CLAUDE.md` — project vision and scope.
- `ROADMAP.md` — the step-by-step build checklist.
- `engineering/CLAUDE.md` — engineering conventions for this codebase.
- `engineering/PROGRESS.md` — living weekly tracker.
- `engineering/DECISIONS.md` — architecture decision log.
- `engineering/docs/PHASE_1/SPEC.md` — detailed spec for the edit features.

## Sibling project

`~/OMC/maquett/engineering/` is the full Next.js track with real Mapbox terrain. It is a separate effort — `maquett_demo/` does not replace or depend on it.
