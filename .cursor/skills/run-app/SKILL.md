---
name: run-app
description: Run the Tennis Tracker app locally — FastAPI backend (port 8000) and Vite/React frontend (port 5173), plus how to run tests and lint. Use when the user asks how to run, start, launch, or serve the app locally, or how to run its tests/lint.
---

# Run Tennis Tracker Locally

Tennis Tracker needs **two processes**: a FastAPI backend and a Vite frontend. The frontend proxies `/api` to the backend, so **start the backend first** — otherwise the UI returns 502 on `/api` calls.

| Service  | Directory   | Command                                                | URL                     |
|----------|-------------|--------------------------------------------------------|-------------------------|
| Backend  | `backend/`  | `.venv/bin/uvicorn app.main:app --reload --port 8000`  | http://localhost:8000   |
| Frontend | `frontend/` | `npm run dev`                                          | http://localhost:5173   |

All data is hardcoded in `backend/app/tennis_data.py` — no network access or API keys are required.

## 1. Backend (`backend/`)

Always use the `backend/.venv` virtualenv. Never install into system Python (no bare `pip`/`pip3`/`python3 -m pip`).

```bash
cd backend
python3 -m venv .venv               # only if .venv does not exist
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Wait for `Application startup complete`. Health check: `curl -s http://localhost:8000/api/health` → `{"status":"ok"}`.

On Debian/Ubuntu, if `python3 -m venv` fails with an `ensurepip` error, install the venv package first: `sudo apt install python3.12-venv` (match your Python version), then recreate `.venv`.

## 2. Frontend (`frontend/`) — second terminal

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173. Use `npm run dev` for local development — do **not** use `npm run build` to serve locally.

Routes: `/atp`, `/wta`, `/countries`, `/results`, `/players/:playerId`, `/final` (`/` redirects to `/atp`).

## Verify both are healthy

```bash
curl -s http://localhost:8000/api/health          # backend liveness
curl -s http://localhost:8000/api/rankings/atp    # backend data
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173   # frontend → 200
```

## Tests and lint

**Backend** (from `backend/`):

```bash
.venv/bin/pip install -r requirements-dev.txt     # once, or after dep changes
.venv/bin/pytest
```

**Frontend** (from `frontend/`):

```bash
npm test          # vitest run
npm run test:watch
npm run lint       # oxlint
npm run build      # production build / type-check (tsc -b && vite build)
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Port 8000 in use | Stop the existing uvicorn process (by PID), or use another port and update the proxy target in `frontend/vite.config.ts` |
| Port 5173 in use | Vite picks the next free port — use the URL it prints |
| Frontend 502 on `/api` | Backend is not running on port 8000 — start it first |
| `ModuleNotFoundError` (Python) | Re-run `.venv/bin/pip install -r requirements.txt`; recreate `.venv` if missing |
| `uvicorn: command not found` | Use `.venv/bin/uvicorn`, not a global install |
| Stale data after editing `tennis_data.py` | Restart the backend — data is loaded into memory at import time |

## Rules

- Start **backend before frontend**.
- Always use `backend/.venv` for Python — create it if missing, install with `.venv/bin/pip`, run with `.venv/bin/uvicorn`.
- Run long-lived servers in the background; don't block on them.
- Use `npm run dev` (not `npm run build`) for local development.
