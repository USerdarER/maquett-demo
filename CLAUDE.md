# Maquett Demo — Project Vision

**Product:** Maquett — a web tool for architecture students that turns a topographic site plan into an editable 3D massing model.

**This directory (`maquett_demo/`):** a **prototype track** focused on the **editing experience**, using a pre-generated procedural site. It is NOT a replacement for `~/OMC/maquett/engineering/` (the full Next.js track with real Mapbox terrain).

---

## Future full product scope
1. Upload a topographic site plan image → generate a 3D massing model.
2. Edit the model: toggle visibility, adjust sun, select/delete buildings, draw new buildings, edit terrain.
3. AI-assisted edits.
4. Export to modeling tools (OBJ / STL / DXF) or as images.

## Prototype scope (this directory)
- Pre-generated procedural terrain + contours + roads + seed buildings (ported from `~/Downloads/topo-model.jsx`).
- **In scope:** toggle visibility, sun position, select building, delete building, draw new building (axis-aligned rectangle + floor count).
- **Out of scope:** upload, export, AI assist, polygonal/rotated footprints, multi-select, edit existing buildings, terrain editing, persistence, Mapbox.

---

## Non-negotiables (from `~/OMC/CLAUDE.md`)
- No hardcoded secrets.
- English for all deliverables.
- Spec-before-work — every feature has a short spec before code.
- camelCase for files/folders (pragmatic: PascalCase for React components, UPPERCASE for always-read docs).

## Where things live
- Engineering code: `engineering/src/`
- Docs: project-level `*.md` at root, engineering-level under `engineering/` and `engineering/docs/`.
- See `engineering/CLAUDE.md` for team-level rules.

## Quick start
`cd engineering && npm install && npm run dev` → open `http://localhost:5173`.
