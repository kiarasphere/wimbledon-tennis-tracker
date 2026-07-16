"""Pydantic response models for the Tennis Tracker API contract."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class SeasonContext(BaseModel):
    model_config = ConfigDict(extra="ignore")

    year: int
    tournament_id: int
    tournament_name: str | None = None
    tournament_official_name: str | None = None
    country_name: str | None = None
    location: str | None = None
    surface: str | None = None
    event_name: str | None = None
    date_start: str | None = None


class PlayerStanding(BaseModel):
    model_config = ConfigDict(extra="ignore")

    position: int
    position_start: int
    player_id: int
    full_name: str | None = None
    name_acronym: str | None = None
    country: str | None = None
    country_colour: str | None = None
    photo_url: str | None = None
    points: float
    points_start: float


class PlayerRankingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    context: SeasonContext
    standings: list[PlayerStanding]


class CountryStanding(BaseModel):
    model_config = ConfigDict(extra="ignore")

    position: int
    position_start: int
    country: str
    country_colour: str | None = None
    points: float
    points_start: float
    player_count: int


class CountryRankingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    context: SeasonContext
    standings: list[CountryStanding]


class TournamentResult(BaseModel):
    model_config = ConfigDict(extra="ignore")

    position: int
    seed: int | None = None
    player_id: int
    full_name: str | None = None
    name_acronym: str | None = None
    country: str | None = None
    country_colour: str | None = None
    photo_url: str | None = None
    round_reached: str | None = None
    score: str | None = None
    retired: bool
    walkover: bool


class TournamentResultsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    context: SeasonContext
    results: list[TournamentResult]


class PlayerProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    player_id: int
    full_name: str | None = None
    name_acronym: str | None = None
    country: str | None = None
    country_colour: str | None = None
    photo_url: str | None = None


class PlayerSeasonSummary(BaseModel):
    model_config = ConfigDict(extra="ignore")

    titles: int
    grand_slams: int
    best_result: str | None = None
    best_result_tournament: str | None = None
    matches_won: int
    matches_lost: int
    win_pct: float


class PlayerSeasonRound(BaseModel):
    model_config = ConfigDict(extra="ignore")

    round: int
    tournament_id: int
    tournament_name: str | None = None
    date_start: str | None = None
    surface: str | None = None
    ranking_points: float | None = None
    ranking_position: int | None = None
    seed: int | None = None
    result: str | None = None
    opponent: str | None = None


class PlayerSeasonResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    context: SeasonContext
    player: PlayerProfile
    summary: PlayerSeasonSummary
    trajectory: list[PlayerSeasonRound]


class MatchPlayer(BaseModel):
    model_config = ConfigDict(extra="ignore")

    player_id: int
    full_name: str | None = None
    name_acronym: str | None = None
    country: str | None = None
    country_colour: str | None = None
    seed: int | None = None


class MatchSet(BaseModel):
    model_config = ConfigDict(extra="ignore")

    set: int
    winner_games: int
    runner_up_games: int
    tiebreak: bool
    winner_tb: int | None = None
    runner_up_tb: int | None = None


class MatchPlayerStats(BaseModel):
    model_config = ConfigDict(extra="ignore")

    aces: int
    double_faults: int
    winners: int
    unforced_errors: int
    first_serve_pct: int
    break_points_saved: str


class MatchStats(BaseModel):
    model_config = ConfigDict(extra="ignore")

    winner: MatchPlayerStats
    runner_up: MatchPlayerStats


class MatchHighlight(BaseModel):
    model_config = ConfigDict(extra="ignore")

    time: str
    description: str


class FinalMatch(BaseModel):
    model_config = ConfigDict(extra="ignore")

    tournament: str
    surface: str
    date: str
    venue: str
    duration_minutes: int
    winner: MatchPlayer
    runner_up: MatchPlayer
    score: str
    sets: list[MatchSet]
    stats: MatchStats
    highlights: list[MatchHighlight]


class FinalMatchResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    context: SeasonContext
    match: FinalMatch


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    status: str


DATA_ROUTE_RESPONSE_MODELS: dict[str, type[BaseModel]] = {
    "/api/rankings/atp": PlayerRankingsResponse,
    "/api/rankings/wta": PlayerRankingsResponse,
    "/api/rankings/countries": CountryRankingsResponse,
    "/api/results/latest": TournamentResultsResponse,
    "/api/players/{player_id}/season": PlayerSeasonResponse,
    "/api/match/final": FinalMatchResponse,
    "/api/health": HealthResponse,
}

CONTRACT_REQUIRED_PROPERTIES: dict[str, list[str]] = {
    "SeasonContext": [
        "year",
        "tournament_id",
        "tournament_name",
        "tournament_official_name",
        "country_name",
        "location",
        "surface",
        "event_name",
        "date_start",
    ],
    "PlayerStanding": [
        "position",
        "position_start",
        "player_id",
        "full_name",
        "name_acronym",
        "country",
        "country_colour",
        "photo_url",
        "points",
        "points_start",
    ],
    "CountryStanding": [
        "position",
        "position_start",
        "country",
        "country_colour",
        "points",
        "points_start",
        "player_count",
    ],
    "TournamentResult": [
        "position",
        "seed",
        "player_id",
        "full_name",
        "name_acronym",
        "country",
        "country_colour",
        "photo_url",
        "round_reached",
        "score",
        "retired",
        "walkover",
    ],
    "PlayerProfile": [
        "player_id",
        "full_name",
        "name_acronym",
        "country",
        "country_colour",
        "photo_url",
    ],
    "PlayerSeasonSummary": [
        "titles",
        "grand_slams",
        "best_result",
        "best_result_tournament",
        "matches_won",
        "matches_lost",
        "win_pct",
    ],
    "PlayerSeasonRound": [
        "round",
        "tournament_id",
        "tournament_name",
        "date_start",
        "surface",
        "ranking_points",
        "ranking_position",
        "seed",
        "result",
        "opponent",
    ],
    "PlayerRankingsResponse": ["context", "standings"],
    "CountryRankingsResponse": ["context", "standings"],
    "TournamentResultsResponse": ["context", "results"],
    "PlayerSeasonResponse": ["context", "player", "summary", "trajectory"],
    "FinalMatchResponse": ["context", "match"],
}
