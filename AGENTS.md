# AGENTS.md

## Cursor Cloud specific instructions

Tennis Tracker is a **frontend-only** Vite/React app (`frontend/`, port 5173). Data is hardcoded in `frontend/src/data/snapshot.json` — no API server is required to run or deploy. An optional FastAPI backend (`backend/`, port 8000) remains as the snapshot source for regeneration/contracts. Standard install/run/lint commands live in `README.md`, `frontend/package.json`, and `.cursor/skills/run-dev-server/SKILL.md` — use those; the notes below only cover non-obvious caveats.

### Running
- Frontend only: `npm run dev` in `frontend/` (do not use `npm run build` for local dev). No backend needed.
- Optional backend: always use `backend/.venv` for Python (create with `python3 -m venv backend/.venv`; run with `backend/.venv/bin/uvicorn app.main:app --reload --port 8000`). Never use system `python`/`pip`.
- Vercel: root `vercel.json` builds `frontend/` as a static SPA.

### Data source (important)
- **No live API.** The UI reads `frontend/src/data/snapshot.json` (15 July 2026 post-Wimbledon rankings and results). No network egress is required.
- Canonical edit source is still `backend/app/tennis_data.py`; regenerate the frontend snapshot with the script in `README.md` after changes.

### Lint / test / build
- Frontend lint: `npm run lint` (oxlint) in `frontend/`. Production build check: `npm run build` (`tsc -b && vite build`).
- **Backend tests:** install with `backend/.venv/bin/pip install -r backend/requirements-dev.txt`, then run `backend/.venv/bin/pytest` from `backend/`. Suites live in `backend/tests/` (`test_main.py`, `conftest.py`).
- **Frontend tests:** `npm test` (`vitest run`) or `npm run test:watch` in `frontend/`. Colocated `*.test.ts` / `*.test.tsx` files cover pages, components, `api.ts`, and `App`.
