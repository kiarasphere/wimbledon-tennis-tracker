# Tennis Tracker

A tennis rankings and results app with **hardcoded data as of 15 July 2026**. It shows ATP and WTA rankings, country standings, the latest tournament results, player season profiles, and final match statistics. The current data snapshot covers Wimbledon 2026, but the app is tournament-agnostic — pages render whatever tournament the data provides.

No live API calls — all data is served from static snapshots in `backend/app/tennis_data.py`.

## Stack

- **Backend:** Python, FastAPI
- **Frontend:** React, TypeScript, Vite, React Router

## Project structure

```text
tennis-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── tennis_data.py
│   ├── tests/
│   ├── requirements.txt
│   └── requirements-dev.txt
└── frontend/
    ├── src/
    └── vite.config.ts
```

## Backend setup

Use a virtual environment in `backend/.venv` — do not install Python packages globally.

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000`.

### Endpoints

- `GET /api/health` — liveness check
- `GET /api/rankings/atp` — ATP singles rankings (top 20)
- `GET /api/rankings/wta` — WTA singles rankings (top 15)
- `GET /api/rankings/countries` — country rankings by total ATP points
- `GET /api/results/latest` — latest tournament results (currently Wimbledon 2026 men's singles)
- `GET /api/players/{player_id}/season` — player season stats and trajectory
- `GET /api/match/final` — Wimbledon 2026 men's final match statistics

### Backend tests

```bash
cd backend
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest
```

## Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend.

### Frontend tests

```bash
cd frontend
npm test
npm run test:watch
```

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
