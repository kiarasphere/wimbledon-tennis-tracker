---
name: run-dev-server
description: Starts the Tennis Tracker frontend (and optional backend) for local development. Use when the user asks to run, start, or launch the dev server, local development environment, or preview the app locally.
---

# Run Tennis Tracker Dev Server

The app is **frontend-only**. Data is hardcoded in `frontend/src/data/snapshot.json` — no API server is required.

An optional FastAPI backend can still be started for contract/API experiments; the UI does not call it.

## Quick reference

| Service  | Directory   | Command                                               | URL                   | Required? |
|----------|-------------|-------------------------------------------------------|-----------------------|-----------|
| Frontend | `frontend/` | `npm run dev`                                         | http://localhost:5173 | Yes       |
| Backend  | `backend/`  | `.venv/bin/uvicorn app.main:app --reload --port 8000` | http://localhost:8000 | Optional  |

**Python rule:** If starting the backend, always use `backend/.venv`. Never run `pip install` or `uvicorn` with the system Python.

## Workflow

```
Task Progress:
- [ ] Step 1: Check if servers are already running
- [ ] Step 2: Install frontend dependencies if missing
- [ ] Step 3: Start frontend
- [ ] Step 4: Verify frontend is healthy
```

### Step 1: Check existing servers

List the terminals folder before starting anything. If a server is already running, do not start a duplicate.

- Frontend healthy: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` returns 200

### Step 2: Install dependencies (first run only)

Skip if `frontend/node_modules` is present.

```bash
cd frontend
npm install
```

### Step 3: Start frontend

Run in the background (`block_until_ms: 0`):

```bash
cd frontend && npm run dev
```

Wait for Vite to report the local URL (typically `http://localhost:5173`).

### Step 4: Verify

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

### Step 5: Open in your browser

Open the app in **your own browser** (your machine), not on a remote/cloud VM:

```bash
# macOS
open http://localhost:5173
# Linux
xdg-open http://localhost:5173
# Windows
start http://localhost:5173
```

Tell the user:
- App URL: http://localhost:5173
- Pages: `/atp`, `/wta`, `/countries`, `/results`, `/players/:playerId`, `/final`
- No backend required

## Optional backend

Only start if the user explicitly asks for the API:

```bash
cd backend
python3 -m venv .venv          # create only if .venv does not exist
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Port 5173 in use | Vite picks the next free port — report the actual URL from terminal output |
| Stale UI data after editing `tennis_data.py` | Regenerate `frontend/src/data/snapshot.json` (see README) and refresh |
| `npm: command not found` | Node.js is not installed |

## Rules

- Prefer **frontend only** — do not start the backend unless requested.
- Always run long-lived servers in the **background**, never block the chat on them.
- Do not run `npm run build` for local development; use `npm run dev`.
- Data is **hardcoded** in `frontend/src/data/snapshot.json` — no external API or egress is required for local dev.
