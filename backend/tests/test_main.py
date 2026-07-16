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


def test_player_season_resolves_wimbledon_semifinalist_fery(client) -> None:
    """Results page links Arthur Fery (id 36); season endpoint must not 404."""
    res = client.get("/api/players/36/season")

    assert res.status_code == 200
    payload = res.json()
    assert payload["player"]["player_id"] == 36
    assert payload["player"]["full_name"] == "Arthur Fery"
    assert payload["summary"]["best_result"] == "Semifinal"
    assert payload["summary"]["best_result_tournament"] == "Wimbledon"
    assert any(t.get("tournament_name") == "Wimbledon" for t in payload["trajectory"])
    PlayerSeasonResponse.model_validate(payload)


def test_player_season_resolves_wimbledon_quarterfinalist_struff(client) -> None:
    """Results page links Jan-Lennard Struff (id 37); season endpoint must not 404."""
    res = client.get("/api/players/37/season")

    assert res.status_code == 200
    payload = res.json()
    assert payload["player"]["player_id"] == 37
    assert payload["player"]["full_name"] == "Jan-Lennard Struff"
    assert payload["summary"]["best_result"] == "Quarterfinal"
    assert payload["summary"]["best_result_tournament"] == "Wimbledon"
    assert any(t.get("tournament_name") == "Wimbledon" for t in payload["trajectory"])
    PlayerSeasonResponse.model_validate(payload)


def test_final_match_returns_200(client) -> None:
    res = client.get("/api/match/final")

    assert res.status_code == 200
    payload = res.json()
    assert payload["match"]["winner"]["full_name"] == "Jannik Sinner"
    FinalMatchResponse.model_validate(payload)
