from __future__ import annotations

from app.schemas import (
    CountryRankingsResponse,
    FinalMatchResponse,
    PlayerRankingsResponse,
    PlayerSeasonResponse,
    TournamentResultsResponse,
)


def test_health_returns_ok(client) -> None:
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_atp_rankings_returns_200(client) -> None:
    res = client.get("/api/rankings/atp")

    assert res.status_code == 200
    payload = res.json()
    assert "context" in payload
    assert "standings" in payload
    assert len(payload["standings"]) >= 10
    PlayerRankingsResponse.model_validate(payload)


def test_wta_rankings_returns_200(client) -> None:
    res = client.get("/api/rankings/wta")

    assert res.status_code == 200
    payload = res.json()
    assert len(payload["standings"]) >= 10
    PlayerRankingsResponse.model_validate(payload)


def test_country_rankings_returns_200(client) -> None:
    res = client.get("/api/rankings/countries")

    assert res.status_code == 200
    payload = res.json()
    assert len(payload["standings"]) >= 5
    CountryRankingsResponse.model_validate(payload)


def test_latest_results_returns_200(client) -> None:
    res = client.get("/api/results/latest")

    assert res.status_code == 200
    payload = res.json()
    assert payload["results"][0]["full_name"] == "Jannik Sinner"
    TournamentResultsResponse.model_validate(payload)


def test_player_season_returns_200(client) -> None:
    res = client.get("/api/players/1/season")

    assert res.status_code == 200
    payload = res.json()
    assert payload["player"]["full_name"] == "Jannik Sinner"
    PlayerSeasonResponse.model_validate(payload)


def test_player_season_returns_404_for_unknown(client) -> None:
    res = client.get("/api/players/9999/season")

    assert res.status_code == 404
    assert res.json()["detail"] == "Player not found"


def test_final_match_returns_200(client) -> None:
    res = client.get("/api/match/final")

    assert res.status_code == 200
    payload = res.json()
    assert payload["match"]["winner"]["full_name"] == "Jannik Sinner"
    FinalMatchResponse.model_validate(payload)
