"""Shared complete API payloads for route and contract tests."""

from __future__ import annotations

from typing import Any

SAMPLE_CONTEXT: dict[str, Any] = {
    "year": 2026,
    "tournament_id": 20260713,
    "tournament_name": "Wimbledon",
    "tournament_official_name": "The Championships, Wimbledon",
    "country_name": "United Kingdom",
    "location": "London",
    "surface": "Grass",
    "event_name": "Post-Wimbledon Rankings",
    "date_start": "2026-07-13",
}

SAMPLE_ATP_RANKINGS: dict[str, Any] = {
    "context": SAMPLE_CONTEXT,
    "standings": [
        {
            "position": 1,
            "position_start": 1,
            "player_id": 1,
            "full_name": "Jannik Sinner",
            "name_acronym": "SIN",
            "country": "ITA",
            "country_colour": "009246",
            "photo_url": None,
            "points": 13450,
            "points_start": 13450,
        }
    ],
}

SAMPLE_WTA_RANKINGS: dict[str, Any] = {
    "context": {**SAMPLE_CONTEXT, "event_name": "WTA Post-Wimbledon Rankings"},
    "standings": [
        {
            "position": 1,
            "position_start": 1,
            "player_id": 101,
            "full_name": "Aryna Sabalenka",
            "name_acronym": "SAB",
            "country": "BLR",
            "country_colour": "4AA657",
            "photo_url": None,
            "points": 8550,
            "points_start": 8550,
        }
    ],
}

SAMPLE_COUNTRY_RANKINGS: dict[str, Any] = {
    "context": {**SAMPLE_CONTEXT, "event_name": "Country Rankings (ATP)"},
    "standings": [
        {
            "position": 1,
            "position_start": 1,
            "country": "ITA",
            "country_colour": "009246",
            "points": 21415,
            "points_start": 20800,
            "player_count": 4,
        }
    ],
}

SAMPLE_WIMBLEDON_RESULTS: dict[str, Any] = {
    "context": {**SAMPLE_CONTEXT, "event_name": "Men's Singles", "date_start": "2026-07-12"},
    "results": [
        {
            "position": 1,
            "seed": 1,
            "player_id": 1,
            "full_name": "Jannik Sinner",
            "name_acronym": "SIN",
            "country": "ITA",
            "country_colour": "009246",
            "photo_url": None,
            "round_reached": "Champion",
            "score": "6-7(7), 7-6(2), 6-3, 6-4",
            "retired": False,
            "walkover": False,
        }
    ],
}

SAMPLE_PLAYER_SEASON: dict[str, Any] = {
    "context": SAMPLE_CONTEXT,
    "player": {
        "player_id": 1,
        "full_name": "Jannik Sinner",
        "name_acronym": "SIN",
        "country": "ITA",
        "country_colour": "009246",
        "photo_url": None,
    },
    "summary": {
        "titles": 3,
        "grand_slams": 1,
        "best_result": "Champion",
        "best_result_tournament": "Wimbledon",
        "matches_won": 42,
        "matches_lost": 5,
        "win_pct": 89.4,
    },
    "trajectory": [
        {
            "round": 1,
            "tournament_id": 20260701,
            "tournament_name": "Wimbledon",
            "date_start": "2026-07-12",
            "surface": "Grass",
            "ranking_points": 13450,
            "ranking_position": 1,
            "seed": 1,
            "result": "Champion",
            "opponent": "Zverev",
        }
    ],
}

SAMPLE_FINAL_MATCH: dict[str, Any] = {
    "context": SAMPLE_CONTEXT,
    "match": {
        "tournament": "Wimbledon 2026",
        "surface": "Grass",
        "date": "2026-07-12",
        "venue": "Centre Court, All England Club",
        "duration_minutes": 226,
        "winner": {
            "player_id": 1,
            "full_name": "Jannik Sinner",
            "name_acronym": "SIN",
            "country": "ITA",
            "country_colour": "009246",
            "seed": 1,
        },
        "runner_up": {
            "player_id": 2,
            "full_name": "Alexander Zverev",
            "name_acronym": "ZVE",
            "country": "GER",
            "country_colour": "FFCE00",
            "seed": 2,
        },
        "score": "6-7(7), 7-6(2), 6-3, 6-4",
        "sets": [
            {
                "set": 1,
                "winner_games": 7,
                "runner_up_games": 6,
                "tiebreak": True,
                "winner_tb": 9,
                "runner_up_tb": 7,
            }
        ],
        "stats": {
            "winner": {
                "aces": 14,
                "double_faults": 2,
                "winners": 58,
                "unforced_errors": 32,
                "first_serve_pct": 68,
                "break_points_saved": "1/1",
            },
            "runner_up": {
                "aces": 13,
                "double_faults": 4,
                "winners": 42,
                "unforced_errors": 38,
                "first_serve_pct": 72,
                "break_points_saved": "2/5",
            },
        },
        "highlights": [
            {
                "time": "Match point",
                "description": "Sinner closes with a forehand winner down the line.",
            }
        ],
    },
}
