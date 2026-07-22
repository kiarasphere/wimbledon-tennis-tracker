---
name: run-app
description: Run the Tennis Tracker app locally on your own machine and open it in your own browser — Vite/React frontend (port 5173), plus how to run tests and lint. Use when the user asks how to run, start, launch, or serve the app locally, open it in their browser, or run its tests/lint.
---

# Run Tennis Tracker on Your Own Machine

Run the app on **your local machine** and open it in **your own browser**, not on a remote/cloud VM. If the servers run on a VM, `http://localhost:5173` in your local browser points at *your* machine (where nothing is listening) and fails with `ERR_CONNECTION_REFUSED`. The steps below run everything locally so `localhost` resolves to your machine.

Tennis Tracker is **frontend-only**. Data is hardcoded in `frontend/src/data/snapshot.json` — no backend is required.

| Service  | Directory   | Command       | URL (your machine)    |
|----------|-------------|---------------|-----------------------|
| Frontend | `frontend/` | `npm run dev` | http://localhost:5173 |

Prereqs: Node 18+ (repo runs on Node 22).

## 0. Get the code (once)

Run this from an empty parent directory — **not** inside an existing checkout of the repo (otherwise you get `destination path ... already exists`). If you already have the repo, skip the clone and just `cd` into it.

```bash
git clone https://github.com/kiarasphere/wimbledon-tennis-tracker.git
cd wimbledon-tennis-tracker
# check out the branch you want, e.g. main once merged
git checkout main
```

## 1. Frontend

```bash
cd "$(git rev-parse --show-toplevel)/frontend"
npm install
npm run dev
```

Use `npm run dev` for local development — do **not** use `npm run build` to serve locally.

## 2. Open it in your browser

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

## Verify

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173   # → 200
```

## Tests and lint

**Frontend** (from `frontend/`):

```bash
npm test          # vitest run
npm run test:watch
npm run lint       # oxlint
npm run build      # production build / type-check (tsc -b && vite build)
```

**Optional backend** (from `backend/`), only if needed for API/contract work:

```bash
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ERR_CONNECTION_REFUSED` on `http://localhost:5173` | The dev server isn't running on *this* machine. Run the frontend locally (step 1). |
| Port 5173 in use | Vite picks the next free port — use the URL it prints |
| Stale UI data after editing `tennis_data.py` | Regenerate `frontend/src/data/snapshot.json` (see README) and refresh |

## Rules

- Run the app **on your own machine** and open it in **your own browser** — not on a remote/cloud VM.
- No backend required for the UI.
- Use `npm run dev` (not `npm run build`) for local development.
