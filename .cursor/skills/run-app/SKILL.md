---
name: run-app
description: Run the Tennis Tracker app locally on your own machine and open it in your own browser — FastAPI backend (port 8000) and Vite/React frontend (port 5173), plus how to run tests and lint. Use when the user asks how to run, start, launch, or serve the app locally, open it in their browser, or run its tests/lint.
---

# Run Tennis Tracker on Your Own Machine

Run the app on **your local machine** and open it in **your own browser**, not on a remote/cloud VM. If the servers run on a VM, `http://localhost:5173` in your local browser points at *your* machine (where nothing is listening) and fails with `ERR_CONNECTION_REFUSED`. The steps below run everything locally so `localhost` resolves to your machine.

Tennis Tracker needs **two processes**: a FastAPI backend and a Vite frontend. The frontend proxies `/api` to the backend, so **start the backend first** — otherwise the UI returns 502 on `/api` calls.

| Service  | Directory   | Command                                                | URL (your machine)      |
|----------|-------------|--------------------------------------------------------|-------------------------|
| Backend  | `backend/`  | `.venv/bin/uvicorn app.main:app --reload --port 8000`  | http://localhost:8000   |
| Frontend | `frontend/` | `npm run dev`                                          | http://localhost:5173   |

All data is hardcoded in `backend/app/tennis_data.py` — no network access or API keys are required.

Prereqs: Python 3.12 and Node 18+ (repo runs on Node 22).

## 0. Get the code (once)

```bash
git clone https://github.com/kiarasphere/wimbledon-tennis-tracker.git
cd wimbledon-tennis-tracker
# check out the branch you want, e.g. main once merged
git checkout main
```

## 1. Backend (`backend/`) — terminal 1

Always use the `backend/.venv` virtualenv. Never install into system Python (no bare `pip`/`pip3`/`python3 -m pip`).

```bash
cd backend
python3 -m venv .venv               # only if .venv does not exist
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Wait for `Application startup complete`. Health check: `curl -s http://localhost:8000/api/health` → `{"status":"ok"}`.

On Debian/Ubuntu, if `python3 -m venv` fails with an `ensurepip` error, install the venv package first: `sudo apt install python3.12-venv` (match your Python version), then recreate `.venv`.

## 2. Frontend (`frontend/`) — terminal 2

```bash
cd frontend
npm install
npm run dev
```

Use `npm run dev` for local development — do **not** use `npm run build` to serve locally.

## 3. Open it in your browser

Open http://localhost:5173 in your own browser:

```bash
# macOS
open http://localhost:5173
# Linux
xdg-open http://localhost:5173
# Windows
start http://localhost:5173
```

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
| `ERR_CONNECTION_REFUSED` on `http://localhost:5173` | The dev server isn't running on *this* machine. Run the frontend locally (step 2). If it runs on a remote/cloud VM, either run it locally instead or forward the VM's ports 5173/8000 to your machine (e.g. `ssh -L 5173:localhost:5173 -L 8000:localhost:8000 <vm>`). |
| Port 8000 in use | Stop the existing uvicorn process (by PID), or use another port and update the proxy target in `frontend/vite.config.ts` |
| Port 5173 in use | Vite picks the next free port — use the URL it prints |
| Frontend 502 on `/api` | Backend is not running on port 8000 — start it first |
| `ModuleNotFoundError` (Python) | Re-run `.venv/bin/pip install -r requirements.txt`; recreate `.venv` if missing |
| `uvicorn: command not found` | Use `.venv/bin/uvicorn`, not a global install |
| Stale data after editing `tennis_data.py` | Restart the backend — data is loaded into memory at import time |

## Rules

- Run the app **on your own machine** and open it in **your own browser** — not on a remote/cloud VM.
- Start **backend before frontend**.
- Always use `backend/.venv` for Python — create it if missing, install with `.venv/bin/pip`, run with `.venv/bin/uvicorn`.
- Use `npm run dev` (not `npm run build`) for local development.
