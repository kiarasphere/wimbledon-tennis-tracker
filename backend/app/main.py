from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import tennis_data
from app.schemas import (
    CountryRankingsResponse,
    FinalMatchResponse,
    HealthResponse,
    PlayerRankingsResponse,
    PlayerSeasonResponse,
    TournamentResultsResponse,
)

PLAYER_NOT_FOUND = "Player not found"

app = FastAPI(title="Tennis Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/api/rankings/atp", response_model=PlayerRankingsResponse)
async def atp_rankings() -> PlayerRankingsResponse:
    return PlayerRankingsResponse.model_validate(tennis_data.get_atp_rankings())


@app.get("/api/rankings/wta", response_model=PlayerRankingsResponse)
async def wta_rankings() -> PlayerRankingsResponse:
    return PlayerRankingsResponse.model_validate(tennis_data.get_wta_rankings())


@app.get("/api/rankings/countries", response_model=CountryRankingsResponse)
async def country_rankings() -> CountryRankingsResponse:
    return CountryRankingsResponse.model_validate(tennis_data.get_country_rankings())


@app.get("/api/results/wimbledon", response_model=TournamentResultsResponse)
async def wimbledon_results() -> TournamentResultsResponse:
    return TournamentResultsResponse.model_validate(tennis_data.get_wimbledon_results())


@app.get("/api/players/{player_id}/season", response_model=PlayerSeasonResponse)
async def player_season_stats(player_id: int) -> PlayerSeasonResponse:
    try:
        return PlayerSeasonResponse.model_validate(tennis_data.get_player_season(player_id))
    except tennis_data.PlayerNotFoundError as exc:
        raise HTTPException(status_code=404, detail=PLAYER_NOT_FOUND) from exc


@app.get("/api/match/final", response_model=FinalMatchResponse)
async def final_match() -> FinalMatchResponse:
    return FinalMatchResponse.model_validate(tennis_data.get_final_match())
