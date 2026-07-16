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

Run this from an empty parent directory — **not** inside an existing checkout of the repo (otherwise you get `destination path ... already exists`). If you already have the repo, skip the clone and just `cd` into it.

```bash
git clone https://github.com/kiarasphere/wimbledon-tennis-tracker.git
cd wimbledon-tennis-tracker
# check out the branch you want, e.g. main once merged
git checkout main
```

> **Use two separate terminals.** The backend and frontend each run a long-lived
> server. `uvicorn` (and `npm run dev`) stay in the foreground and **block their
> terminal** — do not paste both blocks into one terminal. Each block below is
> path-independent (it `cd`s to the repo root first via `git rev-parse`), so it
> works no matter which directory the terminal is in, as long as it's inside the repo.

## 1. Backend — terminal 1

Always use the `backend/.venv` virtualenv. Never install into system Python (no bare `pip`/`pip3`/`python3 -m pip`).

```bash
cd "$(git rev-parse --show-toplevel)/backend"
python3 -m venv .venv               # only if .venv does not exist
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Wait for `Application startup complete`. Health check (in any terminal): `curl -s http://localhost:8000/api/health` → `{"status":"ok"}`.

On Debian/Ubuntu, if `python3 -m venv` fails with an `ensurepip` error, install the venv package first: `sudo apt install python3.12-venv` (match your Python version), then recreate `.venv`.

## 2. Frontend — terminal 2 (a new terminal; leave the backend running)

```bash
cd "$(git rev-parse --show-toplevel)/frontend"
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
| `Address already in use` on port 8000 (backend) | A backend is already running — it may already be serving (`curl http://localhost:8000/api/health`), in which case just skip to the frontend. Otherwise stop the existing process (find it with `lsof -iTCP:8000 -sTCP:LISTEN`, then `kill <PID>`) before restarting. |
| `cd: frontend: No such file or directory` / `npm ... ENOENT ... backend/package.json` | You ran the frontend commands from `backend/`. Frontend and backend are **separate terminals**; use the step 2 block as-is (it `cd`s to `<repo>/frontend`), or `cd` to the repo root first. |
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
