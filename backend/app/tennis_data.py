"""Hardcoded tennis data snapshot as of 15 July 2026.

Data sourced from ATP/WTA rankings (13 July 2026) and Wimbledon 2026 results.
No live API calls — all values are static.
"""

from __future__ import annotations

# Country colours used for badges (hex without #)
COUNTRY_COLOURS: dict[str, str] = {
    "ITA": "009246",
    "GER": "FFCE00",
    "ESP": "AA151B",
    "CAN": "FF0000",
    "AUS": "00843D",
    "USA": "3C3B6E",
    "SRB": "C6363C",
    "RUS": "0039A6",
    "CZE": "11457E",
    "KAZ": "00AFCA",
    "NOR": "BA0C2F",
    "FRA": "0055A4",
    "GBR": "012169",
    "BLR": "4AA657",
    "POL": "DC143C",
    "UKR": "FFD700",
    "JPN": "BC002D",
    "SUI": "FF0000",
    "PHI": "0038A8",
}

CONTEXT = {
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

ATP_RANKINGS = [
    {"position": 1, "position_start": 1, "player_id": 1, "full_name": "Jannik Sinner", "name_acronym": "SIN", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "points": 13450, "points_start": 13450},
    {"position": 2, "position_start": 3, "player_id": 2, "full_name": "Alexander Zverev", "name_acronym": "ZVE", "country": "GER", "country_colour": COUNTRY_COLOURS["GER"], "photo_url": None, "points": 8480, "points_start": 7190},
    {"position": 3, "position_start": 2, "player_id": 3, "full_name": "Carlos Alcaraz", "name_acronym": "ALC", "country": "ESP", "country_colour": COUNTRY_COLOURS["ESP"], "photo_url": None, "points": 8160, "points_start": 9460},
    {"position": 4, "position_start": 4, "player_id": 4, "full_name": "Felix Auger-Aliassime", "name_acronym": "FAA", "country": "CAN", "country_colour": COUNTRY_COLOURS["CAN"], "photo_url": None, "points": 4740, "points_start": 4390},
    {"position": 5, "position_start": 6, "player_id": 5, "full_name": "Alex de Minaur", "name_acronym": "DEM", "country": "AUS", "country_colour": COUNTRY_COLOURS["AUS"], "photo_url": None, "points": 4110, "points_start": 4110},
    {"position": 6, "position_start": 5, "player_id": 6, "full_name": "Ben Shelton", "name_acronym": "SHE", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 3770, "points_start": 4160},
    {"position": 7, "position_start": 8, "player_id": 7, "full_name": "Novak Djokovic", "name_acronym": "DJO", "country": "SRB", "country_colour": COUNTRY_COLOURS["SRB"], "photo_url": None, "points": 3760, "points_start": 3760},
    {"position": 8, "position_start": 9, "player_id": 8, "full_name": "Daniil Medvedev", "name_acronym": "MED", "country": "RUS", "country_colour": COUNTRY_COLOURS["RUS"], "photo_url": None, "points": 3670, "points_start": 3580},
    {"position": 9, "position_start": 10, "player_id": 9, "full_name": "Flavio Cobolli", "name_acronym": "COB", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "points": 3460, "points_start": 3460},
    {"position": 10, "position_start": 7, "player_id": 10, "full_name": "Taylor Fritz", "name_acronym": "FRI", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 3365, "points_start": 3765},
    {"position": 11, "position_start": 11, "player_id": 11, "full_name": "Alexander Bublik", "name_acronym": "BUB", "country": "KAZ", "country_colour": COUNTRY_COLOURS["KAZ"], "photo_url": None, "points": 2810, "points_start": 2620},
    {"position": 12, "position_start": 14, "player_id": 12, "full_name": "Jiri Lehecka", "name_acronym": "LEH", "country": "CZE", "country_colour": COUNTRY_COLOURS["CZE"], "photo_url": None, "points": 2510, "points_start": 2360},
    {"position": 13, "position_start": 12, "player_id": 13, "full_name": "Casper Ruud", "name_acronym": "RUU", "country": "NOR", "country_colour": COUNTRY_COLOURS["NOR"], "photo_url": None, "points": 2435, "points_start": 2425},
    {"position": 14, "position_start": 15, "player_id": 14, "full_name": "Lorenzo Musetti", "name_acronym": "MUS", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "points": 2315, "points_start": 2325},
    {"position": 15, "position_start": 17, "player_id": 15, "full_name": "Learner Tien", "name_acronym": "TIE", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 2270, "points_start": 2270},
    {"position": 16, "position_start": 13, "player_id": 16, "full_name": "Andrey Rublev", "name_acronym": "RUB", "country": "RUS", "country_colour": COUNTRY_COLOURS["RUS"], "photo_url": None, "points": 2230, "points_start": 2420},
    {"position": 17, "position_start": 19, "player_id": 17, "full_name": "Frances Tiafoe", "name_acronym": "TIA", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 2230, "points_start": 2180},
    {"position": 18, "position_start": 16, "player_id": 18, "full_name": "Luciano Darderi", "name_acronym": "DAR", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "points": 2210, "points_start": 2300},
    {"position": 19, "position_start": 18, "player_id": 19, "full_name": "Jakub Mensik", "name_acronym": "MEN", "country": "CZE", "country_colour": COUNTRY_COLOURS["CZE"], "photo_url": None, "points": 2205, "points_start": 2255},
    {"position": 20, "position_start": 20, "player_id": 20, "full_name": "Alejandro Davidovich Fokina", "name_acronym": "ADF", "country": "ESP", "country_colour": COUNTRY_COLOURS["ESP"], "photo_url": None, "points": 2160, "points_start": 2060},
]

WTA_RANKINGS = [
    {"position": 1, "position_start": 1, "player_id": 101, "full_name": "Aryna Sabalenka", "name_acronym": "SAB", "country": "BLR", "country_colour": COUNTRY_COLOURS["BLR"], "photo_url": None, "points": 8550, "points_start": 8550},
    {"position": 2, "position_start": 2, "player_id": 102, "full_name": "Elena Rybakina", "name_acronym": "RYB", "country": "KAZ", "country_colour": COUNTRY_COLOURS["KAZ"], "photo_url": None, "points": 8143, "points_start": 8143},
    {"position": 3, "position_start": 4, "player_id": 103, "full_name": "Jessica Pegula", "name_acronym": "PEG", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 6301, "points_start": 5293},
    {"position": 4, "position_start": 7, "player_id": 104, "full_name": "Coco Gauff", "name_acronym": "GAU", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 5649, "points_start": 4879},
    {"position": 5, "position_start": 5, "player_id": 105, "full_name": "Mirra Andreeva", "name_acronym": "AND", "country": "RUS", "country_colour": COUNTRY_COLOURS["RUS"], "photo_url": None, "points": 5293, "points_start": 5293},
    {"position": 6, "position_start": 9, "player_id": 106, "full_name": "Karolina Muchova", "name_acronym": "MUC", "country": "CZE", "country_colour": COUNTRY_COLOURS["CZE"], "photo_url": None, "points": 5168, "points_start": 3878},
    {"position": 7, "position_start": 12, "player_id": 107, "full_name": "Linda Noskova", "name_acronym": "NOS", "country": "CZE", "country_colour": COUNTRY_COLOURS["CZE"], "photo_url": None, "points": 5119, "points_start": 3359},
    {"position": 8, "position_start": 3, "player_id": 108, "full_name": "Iga Swiatek", "name_acronym": "SWI", "country": "POL", "country_colour": COUNTRY_COLOURS["POL"], "photo_url": None, "points": 4539, "points_start": 5523},
    {"position": 9, "position_start": 6, "player_id": 109, "full_name": "Amanda Anisimova", "name_acronym": "ANI", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "points": 4353, "points_start": 4435},
    {"position": 10, "position_start": 8, "player_id": 110, "full_name": "Elina Svitolina", "name_acronym": "SVI", "country": "UKR", "country_colour": COUNTRY_COLOURS["UKR"], "photo_url": None, "points": 4351, "points_start": 4471},
    {"position": 11, "position_start": 13, "player_id": 111, "full_name": "Marta Kostyuk", "name_acronym": "KOS", "country": "UKR", "country_colour": COUNTRY_COLOURS["UKR"], "photo_url": None, "points": 3926, "points_start": 3926},
    {"position": 12, "position_start": 10, "player_id": 112, "full_name": "Victoria Mboko", "name_acronym": "MBO", "country": "CAN", "country_colour": COUNTRY_COLOURS["CAN"], "photo_url": None, "points": 3570, "points_start": 3570},
    {"position": 13, "position_start": 14, "player_id": 113, "full_name": "Naomi Osaka", "name_acronym": "OSA", "country": "JPN", "country_colour": COUNTRY_COLOURS["JPN"], "photo_url": None, "points": 3146, "points_start": 3146},
    {"position": 14, "position_start": 11, "player_id": 114, "full_name": "Belinda Bencic", "name_acronym": "BEN", "country": "SUI", "country_colour": COUNTRY_COLOURS["SUI"], "photo_url": None, "points": 2845, "points_start": 2845},
    {"position": 15, "position_start": 17, "player_id": 115, "full_name": "Jasmine Paolini", "name_acronym": "PAO", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "points": 2783, "points_start": 2783},
]

COUNTRY_RANKINGS = [
    {"position": 1, "position_start": 1, "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "points": 21415, "points_start": 20800, "player_count": 4},
    {"position": 2, "position_start": 2, "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "points": 18640, "points_start": 18100, "player_count": 4},
    {"position": 3, "position_start": 4, "country": "ESP", "country_colour": COUNTRY_COLOURS["ESP"], "points": 10320, "points_start": 9800, "player_count": 2},
    {"position": 4, "position_start": 3, "country": "GER", "country_colour": COUNTRY_COLOURS["GER"], "points": 8480, "points_start": 7190, "player_count": 1},
    {"position": 5, "position_start": 5, "country": "CZE", "country_colour": COUNTRY_COLOURS["CZE"], "points": 10289, "points_start": 8900, "player_count": 3},
    {"position": 6, "position_start": 6, "country": "RUS", "country_colour": COUNTRY_COLOURS["RUS"], "points": 8135, "points_start": 8000, "player_count": 2},
    {"position": 7, "position_start": 7, "country": "SRB", "country_colour": COUNTRY_COLOURS["SRB"], "points": 3760, "points_start": 3760, "player_count": 1},
    {"position": 8, "position_start": 8, "country": "AUS", "country_colour": COUNTRY_COLOURS["AUS"], "points": 4110, "points_start": 4110, "player_count": 1},
    {"position": 9, "position_start": 9, "country": "CAN", "country_colour": COUNTRY_COLOURS["CAN"], "points": 4740, "points_start": 4390, "player_count": 1},
    {"position": 10, "position_start": 10, "country": "KAZ", "country_colour": COUNTRY_COLOURS["KAZ"], "points": 2810, "points_start": 2620, "player_count": 1},
]

LATEST_RESULTS = [
    {"position": 1, "seed": 1, "player_id": 1, "full_name": "Jannik Sinner", "name_acronym": "SIN", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "round_reached": "Champion", "score": "6-7(7), 7-6(2), 6-3, 6-4", "retired": False, "walkover": False},
    {"position": 2, "seed": 2, "player_id": 2, "full_name": "Alexander Zverev", "name_acronym": "ZVE", "country": "GER", "country_colour": COUNTRY_COLOURS["GER"], "photo_url": None, "round_reached": "Final", "score": None, "retired": False, "walkover": False},
    {"position": 3, "seed": 7, "player_id": 7, "full_name": "Novak Djokovic", "name_acronym": "DJO", "country": "SRB", "country_colour": COUNTRY_COLOURS["SRB"], "photo_url": None, "round_reached": "Semifinal", "score": "L 4-6, 4-6, 4-6 vs Sinner", "retired": False, "walkover": False},
    {"position": 4, "seed": None, "player_id": 36, "full_name": "Arthur Fery", "name_acronym": "FER", "country": "GBR", "country_colour": COUNTRY_COLOURS["GBR"], "photo_url": None, "round_reached": "Semifinal", "score": "L 6-7, 2-6, 4-6 vs Zverev", "retired": False, "walkover": False},
    {"position": 5, "seed": 3, "player_id": 4, "full_name": "Felix Auger-Aliassime", "name_acronym": "FAA", "country": "CAN", "country_colour": COUNTRY_COLOURS["CAN"], "photo_url": None, "round_reached": "Quarterfinal", "score": "L 6-10, 6-7, 3-6, 7-7, 6-4 vs Djokovic", "retired": False, "walkover": False},
    {"position": 6, "seed": 6, "player_id": 10, "full_name": "Taylor Fritz", "name_acronym": "FRI", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "round_reached": "Quarterfinal", "score": "L 4-6, 4-6, 2-6 vs Fery", "retired": False, "walkover": False},
    {"position": 7, "seed": 9, "player_id": 9, "full_name": "Flavio Cobolli", "name_acronym": "COB", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None, "round_reached": "Quarterfinal", "score": "L 4-6, 6-4, 0-6 vs Zverev", "retired": False, "walkover": False},
    {"position": 8, "seed": None, "player_id": 37, "full_name": "Jan-Lennard Struff", "name_acronym": "STR", "country": "GER", "country_colour": COUNTRY_COLOURS["GER"], "photo_url": None, "round_reached": "Quarterfinal", "score": "L 5-7, 6-4, 3-6 vs Sinner", "retired": False, "walkover": False},
    {"position": 9, "seed": 5, "player_id": 5, "full_name": "Alex de Minaur", "name_acronym": "DEM", "country": "AUS", "country_colour": COUNTRY_COLOURS["AUS"], "photo_url": None, "round_reached": "Round of 16", "score": "L 5-7, 6-7, 3-6 vs Cobolli", "retired": False, "walkover": False},
    {"position": 10, "seed": 8, "player_id": 8, "full_name": "Daniil Medvedev", "name_acronym": "MED", "country": "RUS", "country_colour": COUNTRY_COLOURS["RUS"], "photo_url": None, "round_reached": "Round of 16", "score": "L 6-7, 7-7, 6-2, 5-7, 2r vs Struff", "retired": True, "walkover": False},
    {"position": 11, "seed": 4, "player_id": 6, "full_name": "Ben Shelton", "name_acronym": "SHE", "country": "USA", "country_colour": COUNTRY_COLOURS["USA"], "photo_url": None, "round_reached": "Round of 64", "score": "L in R1", "retired": False, "walkover": False},
    {"position": 12, "seed": 11, "player_id": 13, "full_name": "Casper Ruud", "name_acronym": "RUU", "country": "NOR", "country_colour": COUNTRY_COLOURS["NOR"], "photo_url": None, "round_reached": "Round of 64", "score": "L in R1", "retired": False, "walkover": False},
]

FINAL_MATCH = {
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
        "country_colour": COUNTRY_COLOURS["ITA"],
        "seed": 1,
    },
    "runner_up": {
        "player_id": 2,
        "full_name": "Alexander Zverev",
        "name_acronym": "ZVE",
        "country": "GER",
        "country_colour": COUNTRY_COLOURS["GER"],
        "seed": 2,
    },
    "score": "6-7(7), 7-6(2), 6-3, 6-4",
    "sets": [
        {"set": 1, "winner_games": 7, "runner_up_games": 6, "tiebreak": True, "winner_tb": 9, "runner_up_tb": 7},
        {"set": 2, "winner_games": 7, "runner_up_games": 6, "tiebreak": True, "winner_tb": 7, "runner_up_tb": 2},
        {"set": 3, "winner_games": 6, "runner_up_games": 3, "tiebreak": False, "winner_tb": None, "runner_up_tb": None},
        {"set": 4, "winner_games": 6, "runner_up_games": 4, "tiebreak": False, "winner_tb": None, "runner_up_tb": None},
    ],
    "stats": {
        "winner": {"aces": 14, "double_faults": 2, "winners": 58, "unforced_errors": 32, "first_serve_pct": 68, "break_points_saved": "1/1"},
        "runner_up": {"aces": 13, "double_faults": 4, "winners": 42, "unforced_errors": 38, "first_serve_pct": 72, "break_points_saved": "2/5"},
    },
    "highlights": [
        {"time": "Set 1", "description": "Zverev wins marathon opening tiebreak 9-7, ending Sinner's 14-set streak against him."},
        {"time": "Set 2", "description": "Sinner levels with a dominant 7-2 second-set tiebreak."},
        {"time": "Set 3, 3-3", "description": "Zverev slips chasing a drop shot, appears to hurt his knee — Sinner breaks and takes the set 6-3."},
        {"time": "Set 4, 3-3", "description": "Sinner breaks again; Zverev commits three unforced errors in the game."},
        {"time": "Match point", "description": "Sinner closes with a forehand winner down the line after a spectacular rally of drop shots."},
    ],
}

# Player season trajectories keyed by player_id
PLAYER_SEASONS: dict[int, dict] = {
    1: {
        "player": {"player_id": 1, "full_name": "Jannik Sinner", "name_acronym": "SIN", "country": "ITA", "country_colour": COUNTRY_COLOURS["ITA"], "photo_url": None},
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
            {"round": 1, "tournament_id": 20260101, "tournament_name": "Australian Open", "date_start": "2026-01-26", "surface": "Hard", "ranking_points": 12000, "ranking_position": 1, "seed": 1, "result": "Semifinal", "opponent": "Zverev"},
            {"round": 2, "tournament_id": 20260301, "tournament_name": "Indian Wells", "date_start": "2026-03-05", "surface": "Hard", "ranking_points": 12500, "ranking_position": 1, "seed": 1, "result": "Champion", "opponent": "Alcaraz"},
            {"round": 3, "tournament_id": 20260501, "tournament_name": "French Open", "date_start": "2026-05-25", "surface": "Clay", "ranking_points": 12800, "ranking_position": 1, "seed": 1, "result": "Quarterfinal", "opponent": "Ruud"},
            {"round": 4, "tournament_id": 20260701, "tournament_name": "Wimbledon", "date_start": "2026-07-12", "surface": "Grass", "ranking_points": 13450, "ranking_position": 1, "seed": 1, "result": "Champion", "opponent": "Zverev"},
        ],
    },
    2: {
        "player": {"player_id": 2, "full_name": "Alexander Zverev", "name_acronym": "ZVE", "country": "GER", "country_colour": COUNTRY_COLOURS["GER"], "photo_url": None},
        "summary": {
            "titles": 2,
            "grand_slams": 0,
            "best_result": "Runner-up",
            "best_result_tournament": "Wimbledon",
            "matches_won": 38,
            "matches_lost": 8,
            "win_pct": 82.6,
        },
        "trajectory": [
            {"round": 1, "tournament_id": 20260101, "tournament_name": "Australian Open", "date_start": "2026-01-26", "surface": "Hard", "ranking_points": 6500, "ranking_position": 3, "seed": 3, "result": "Quarterfinal", "opponent": "Medvedev"},
            {"round": 2, "tournament_id": 20260501, "tournament_name": "French Open", "date_start": "2026-05-25", "surface": "Clay", "ranking_points": 7190, "ranking_position": 3, "seed": 2, "result": "Champion", "opponent": "Alcaraz"},
            {"round": 3, "tournament_id": 20260701, "tournament_name": "Wimbledon", "date_start": "2026-07-12", "surface": "Grass", "ranking_points": 8480, "ranking_position": 2, "seed": 2, "result": "Runner-up", "opponent": "Sinner"},
        ],
    },
    7: {
        "player": {"player_id": 7, "full_name": "Novak Djokovic", "name_acronym": "DJO", "country": "SRB", "country_colour": COUNTRY_COLOURS["SRB"], "photo_url": None},
        "summary": {
            "titles": 0,
            "grand_slams": 0,
            "best_result": "Semifinal",
            "best_result_tournament": "Wimbledon",
            "matches_won": 28,
            "matches_lost": 6,
            "win_pct": 82.4,
        },
        "trajectory": [
            {"round": 1, "tournament_id": 20260101, "tournament_name": "Australian Open", "date_start": "2026-01-26", "surface": "Hard", "ranking_points": 3800, "ranking_position": 7, "seed": 7, "result": "Quarterfinal", "opponent": "Sinner"},
            {"round": 2, "tournament_id": 20260501, "tournament_name": "French Open", "date_start": "2026-05-25", "surface": "Clay", "ranking_points": 3760, "ranking_position": 7, "seed": 6, "result": "Round of 16", "opponent": "Musetti"},
            {"round": 3, "tournament_id": 20260701, "tournament_name": "Wimbledon", "date_start": "2026-07-12", "surface": "Grass", "ranking_points": 3760, "ranking_position": 7, "seed": 7, "result": "Semifinal", "opponent": "Sinner"},
        ],
    },
}


class PlayerNotFoundError(Exception):
    """Raised when a player_id has no season data."""


def get_atp_rankings() -> dict:
    return {"context": CONTEXT, "standings": ATP_RANKINGS}


def get_wta_rankings() -> dict:
    wta_context = {**CONTEXT, "event_name": "WTA Post-Wimbledon Rankings"}
    return {"context": wta_context, "standings": WTA_RANKINGS}


def get_country_rankings() -> dict:
    country_context = {**CONTEXT, "event_name": "Country Rankings (ATP)"}
    return {"context": country_context, "standings": COUNTRY_RANKINGS}


def get_latest_results() -> dict:
    results_context = {
        **CONTEXT,
        "event_name": "Men's Singles",
        "date_start": "2026-07-12",
    }
    return {"context": results_context, "results": LATEST_RESULTS}


def get_final_match() -> dict:
    return {"context": CONTEXT, "match": FINAL_MATCH}


def get_player_season(player_id: int) -> dict:
    season = PLAYER_SEASONS.get(player_id)
    if season is None:
        # Build a minimal profile from ATP rankings if available
        for standing in ATP_RANKINGS:
            if standing["player_id"] == player_id:
                return {
                    "context": CONTEXT,
                    "player": {
                        "player_id": standing["player_id"],
                        "full_name": standing["full_name"],
                        "name_acronym": standing["name_acronym"],
                        "country": standing["country"],
                        "country_colour": standing["country_colour"],
                        "photo_url": standing["photo_url"],
                    },
                    "summary": {
                        "titles": 0,
                        "grand_slams": 0,
                        "best_result": None,
                        "best_result_tournament": None,
                        "matches_won": 0,
                        "matches_lost": 0,
                        "win_pct": 0.0,
                    },
                    "trajectory": [],
                }
        raise PlayerNotFoundError(f"Player {player_id} not found")
    return {"context": CONTEXT, **season}
