# Tennis Tracker

A tennis rankings and results app with **hardcoded data as of 15 July 2026**. It shows ATP and WTA rankings, country standings, the latest tournament results, player season profiles, and final match statistics. The current data snapshot covers Wimbledon 2026, but the app is tournament-agnostic — pages render whatever tournament the data provides.

**Frontend-only:** the UI loads data from `frontend/src/data/snapshot.json`. No backend is required to run or deploy the app (including on Vercel).

## Stack

- **Frontend:** React, TypeScript, Vite, React Router
- **Backend (optional):** Python, FastAPI — kept for local API/contract work; not used by the deployed UI

## Project structure

```text
tennis-tracker/
├── vercel.json                 # Vercel build (frontend only)
├── backend/                    # optional FastAPI source of the snapshot
└── frontend/
    ├── src/
    │   ├── data/snapshot.json  # hardcoded season data
    │   └── api.ts              # local data accessors (no network)
    └── vite.config.ts
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. No API server is needed.

### Frontend tests

```bash
cd frontend
npm test
npm run test:watch
```

### Deploy to Vercel

From the repo root (uses root `vercel.json`):

```bash
npx vercel
```

Or set the Vercel project **Root Directory** to `frontend` and deploy that folder.

## Pages

- `/atp` — ATP singles rankings with country flags and ranking point changes
- `/wta` — WTA singles rankings
- `/countries` — Country rankings by combined ATP points
- `/results` — latest tournament results (currently Wimbledon 2026 men's singles draw finishers)
- `/players/:playerId` — Player season profile with tournament trajectory
- `/final` — latest final scoreboard, set scores, match stats, and key moments

## Data snapshot

All data reflects the tennis landscape as of **15 July 2026**, immediately after Wimbledon:

- **ATP #1:** Jannik Sinner (13,450 pts) — defended Wimbledon title
- **ATP #2:** Alexander Zverev (8,480 pts) — Wimbledon runner-up
- **WTA #1:** Aryna Sabalenka (8,550 pts)
- **Wimbledon women's champion:** Linda Noskova def. Karolina Muchova 6-2, 5-7, 6-3
- **Wimbledon men's final:** Sinner def. Zverev 6-7(7), 7-6(2), 6-3, 6-4

To refresh the frontend snapshot from the optional backend source:

```bash
cd backend
.venv/bin/python - <<'PY'
import json
from pathlib import Path
from app import tennis_data

out = Path('../frontend/src/data/snapshot.json')
payload = {
    'atpRankings': tennis_data.get_atp_rankings(),
    'wtaRankings': tennis_data.get_wta_rankings(),
    'countryRankings': tennis_data.get_country_rankings(),
    'latestResults': tennis_data.get_latest_results(),
    'finalMatch': tennis_data.get_final_match(),
    'playerSeasons': {
        str(pid): {'context': tennis_data.CONTEXT, **season}
        for pid, season in tennis_data.PLAYER_SEASONS.items()
    },
    'atpPlayerProfiles': {
        str(s['player_id']): {
            'player_id': s['player_id'],
            'full_name': s['full_name'],
            'name_acronym': s['name_acronym'],
            'country': s['country'],
            'country_colour': s['country_colour'],
            'photo_url': s['photo_url'],
        }
        for s in tennis_data.ATP_RANKINGS
    },
    'context': tennis_data.CONTEXT,
}
out.write_text(json.dumps(payload, indent=2) + '\n')
print('Wrote', out)
PY
```

## Optional backend

The FastAPI app in `backend/` still exposes the same snapshot over HTTP for local API experiments. It is not required for the UI.

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```
