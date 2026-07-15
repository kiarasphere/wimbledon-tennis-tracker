---
name: run-dev-server
description: Starts the Tennis Tracker backend and frontend dev servers. Use when the user asks to run, start, or launch the dev server, local development environment, or preview the app locally.
---

# Run Tennis Tracker Dev Server

This project needs **two processes**: a FastAPI backend and a Vite frontend. The frontend proxies `/api` to the backend.

## Quick reference

| Service  | Directory   | Command                                                         | URL                      |
|----------|-------------|-----------------------------------------------------------------|--------------------------|
| Backend  | `backend/`  | `.venv/bin/uvicorn app.main:app --reload --port 8000`           | http://localhost:8000    |
| Frontend | `frontend/` | `npm run dev`                                                   | http://localhost:5173    |

**Python rule:** Always use `backend/.venv`. Never run `pip install` or `uvicorn` with the system Python.

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Check if servers are already running
- [ ] Step 2: Install dependencies if missing
- [ ] Step 3: Start backend
- [ ] Step 4: Start frontend
- [ ] Step 5: Verify both are healthy
```

### Step 1: Check existing servers

List the terminals folder before starting anything. If a server is already running, do not start a duplicate.

- Backend healthy: `curl -s http://localhost:8000/api/health` returns 200
- Frontend healthy: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` returns 200

### Step 2: Install dependencies (first run only)

Skip backend setup if `backend/.venv` exists with packages installed. Skip frontend if `frontend/node_modules` is present.

**Backend (venv required):**

```bash
cd backend
python3 -m venv .venv          # create only if .venv does not exist
.venv/bin/pip install -r requirements.txt
```

Never use bare `pip`, `pip3`, or `python3 -m pip` without the venv — that installs into system Python.

**Frontend:**

```bash
cd frontend
npm install
```

### Step 3: Start backend

Confirm `backend/.venv/bin/uvicorn` exists before starting. Run in the background (`block_until_ms: 0`):

```bash
cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000
```

Wait for `Application startup complete` in terminal output.

### Step 4: Start frontend

Run in the background (`block_until_ms: 0`):

```bash
cd frontend && npm run dev
```

Wait for Vite to report the local URL (typically `http://localhost:5173`).

### Step 5: Verify

```bash
curl -s http://localhost:8000/api/health
curl -s http://localhost:8000/api/rankings/atp
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

Tell the user:
- App URL: http://localhost:5173
- API URL: http://localhost:8000
- Pages: `/atp`, `/wta`, `/countries`, `/results`, `/players/:playerId`, `/final`

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Port 8000 in use | Find and stop the existing uvicorn process, or use a different port and update `frontend/vite.config.ts` proxy target |
| Port 5173 in use | Vite picks the next free port — report the actual URL from terminal output |
| Frontend 502 on `/api` | Backend is not running or not on port 8000 — restart backend first |
| Stale data after editing `tennis_data.py` | Restart the backend — data is hardcoded in memory at import time |
| `ModuleNotFoundError` (Python) | Re-run `.venv/bin/pip install -r requirements.txt` in `backend/`; recreate venv with `python3 -m venv .venv` if missing |
| `uvicorn: command not found` | Use `.venv/bin/uvicorn`, not a global install |
| `npm: command not found` | Node.js is not installed |

## Rules

- **Always use `backend/.venv`** for Python — create it if missing, install with `.venv/bin/pip`, run with `.venv/bin/uvicorn`. Never install packages globally or with system Python.
- Always run long-lived servers in the **background**, never block the chat on them.
- Start **backend before frontend** — the UI depends on `/api` proxying to port 8000.
- Do not run `npm run build` for local development; use `npm run dev`.
- Data is **hardcoded** in `backend/app/tennis_data.py` — no external API or egress is required for local dev.
