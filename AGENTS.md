# AGENTS.md

## Cursor Cloud specific instructions

Tennis Tracker is a two-process dev app: a FastAPI backend (`backend/`, port 8000) and a Vite/React frontend (`frontend/`, port 5173). The frontend proxies `/api` to the backend. Standard install/run/lint commands live in `README.md`, `frontend/package.json`, and `.cursor/skills/run-dev-server/SKILL.md` — use those; the notes below only cover non-obvious caveats.

### Running
- Start the backend **before** the frontend — the Vite proxy forwards `/api` to `http://localhost:8000`, so the UI 502s if the backend is down. See `.cursor/skills/run-dev-server/SKILL.md`.
- Always use `backend/.venv` for Python (create with `python3 -m venv backend/.venv`; run with `backend/.venv/bin/uvicorn app.main:app --reload --port 8000`). Never use system `python`/`pip`.
- Frontend dev server is `npm run dev` in `frontend/` (do not use `npm run build` for local dev).

### Data source (important)
- **No live API.** All tennis data is hardcoded in `backend/app/tennis_data.py` as a snapshot from 15 July 2026 (post-Wimbledon rankings and results). No network egress is required for the backend to serve data.
- To update data, edit `tennis_data.py` directly and restart the backend.

### Lint / test / build
- Frontend lint: `npm run lint` (oxlint) in `frontend/`. Production build check: `npm run build` (`tsc -b && vite build`).
- **Backend tests:** install with `backend/.venv/bin/pip install -r backend/requirements-dev.txt`, then run `backend/.venv/bin/pytest` from `backend/`. Suites live in `backend/tests/` (`test_main.py`, `conftest.py`).
- **Frontend tests:** `npm test` (`vitest run`) or `npm run test:watch` in `frontend/`. Colocated `*.test.ts` / `*.test.tsx` files cover pages, components, `api.ts`, and `App`.
