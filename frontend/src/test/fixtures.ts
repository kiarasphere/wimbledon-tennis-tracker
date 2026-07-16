import type {
  CountryRankingsResponse,
  FinalMatchResponse,
  PlayerRankingsResponse,
  PlayerSeasonResponse,
  SeasonContext,
  TournamentResultsResponse,
} from '../api'

export const mockContext: SeasonContext = {
  year: 2026,
  tournament_id: 20260713,
  tournament_name: 'Wimbledon',
  tournament_official_name: 'The Championships, Wimbledon',
  country_name: 'United Kingdom',
  location: 'London',
  surface: 'Grass',
  event_name: 'Post-Wimbledon Rankings',
  date_start: '2026-07-13',
}

export const mockAtpRankings: PlayerRankingsResponse = {
  context: mockContext,
  standings: [
    {
      position: 1,
      position_start: 1,
      player_id: 1,
      full_name: 'Jannik Sinner',
      name_acronym: 'SIN',
      country: 'ITA',
      country_colour: '009246',
      photo_url: null,
      points: 13450,
      points_start: 13450,
    },
    {
      position: 2,
      position_start: 3,
      player_id: 2,
      full_name: 'Alexander Zverev',
      name_acronym: 'ZVE',
      country: 'GER',
      country_colour: 'FFCE00',
      photo_url: null,
      points: 8480,
      points_start: 7190,
    },
  ],
}

export const mockWtaRankings: PlayerRankingsResponse = {
  context: { ...mockContext, event_name: 'WTA Post-Wimbledon Rankings' },
  standings: [
    {
      position: 1,
      position_start: 1,
      player_id: 101,
      full_name: 'Aryna Sabalenka',
      name_acronym: 'SAB',
      country: 'BLR',
      country_colour: '4AA657',
      photo_url: null,
      points: 8550,
      points_start: 8550,
    },
  ],
}

export const mockCountryRankings: CountryRankingsResponse = {
  context: { ...mockContext, event_name: 'Country Rankings (ATP)' },
  standings: [
    {
      position: 1,
      position_start: 1,
      country: 'ITA',
      country_colour: '009246',
      points: 21415,
      points_start: 20800,
      player_count: 4,
    },
  ],
}

export const mockLatestResults: TournamentResultsResponse = {
  context: { ...mockContext, event_name: "Men's Singles", date_start: '2026-07-12' },
  results: [
    {
      position: 1,
      seed: 1,
      player_id: 1,
      full_name: 'Jannik Sinner',
      name_acronym: 'SIN',
      country: 'ITA',
      country_colour: '009246',
      photo_url: null,
      round_reached: 'Champion',
      score: '6-7(7), 7-6(2), 6-3, 6-4',
      retired: false,
      walkover: false,
    },
    {
      position: 2,
      seed: 2,
      player_id: 2,
      full_name: 'Alexander Zverev',
      name_acronym: 'ZVE',
      country: 'GER',
      country_colour: 'FFCE00',
      photo_url: null,
      round_reached: 'Final',
      score: null,
      retired: false,
      walkover: false,
    },
  ],
}

export const mockPlayerSeason: PlayerSeasonResponse = {
  context: mockContext,
  player: {
    player_id: 1,
    full_name: 'Jannik Sinner',
    name_acronym: 'SIN',
    country: 'ITA',
    country_colour: '009246',
    photo_url: null,
  },
  summary: {
    titles: 3,
    grand_slams: 1,
    best_result: 'Champion',
    best_result_tournament: 'Wimbledon',
    matches_won: 42,
    matches_lost: 5,
    win_pct: 89.4,
  },
  trajectory: [
    {
      round: 1,
      tournament_id: 20260701,
      tournament_name: 'Wimbledon',
      date_start: '2026-07-12',
      surface: 'Grass',
      ranking_points: 13450,
      ranking_position: 1,
      seed: 1,
      result: 'Champion',
      opponent: 'Zverev',
    },
  ],
}

export const mockFinalMatch: FinalMatchResponse = {
  context: mockContext,
  match: {
    tournament: 'Wimbledon 2026',
    surface: 'Grass',
    date: '2026-07-12',
    venue: 'Centre Court, All England Club',
    duration_minutes: 226,
    winner: {
      player_id: 1,
      full_name: 'Jannik Sinner',
      name_acronym: 'SIN',
      country: 'ITA',
      country_colour: '009246',
      seed: 1,
    },
    runner_up: {
      player_id: 2,
      full_name: 'Alexander Zverev',
      name_acronym: 'ZVE',
      country: 'GER',
      country_colour: 'FFCE00',
      seed: 2,
    },
    score: '6-7(7), 7-6(2), 6-3, 6-4',
    sets: [
      {
        set: 1,
        winner_games: 7,
        runner_up_games: 6,
        tiebreak: true,
        winner_tb: 9,
        runner_up_tb: 7,
      },
    ],
    stats: {
      winner: {
        aces: 14,
        double_faults: 2,
        winners: 58,
        unforced_errors: 32,
        first_serve_pct: 68,
        break_points_saved: '1/1',
      },
      runner_up: {
        aces: 13,
        double_faults: 4,
        winners: 42,
        unforced_errors: 38,
        first_serve_pct: 72,
        break_points_saved: '2/5',
      },
    },
    highlights: [
      {
        time: 'Match point',
        description: 'Sinner closes with a forehand winner down the line.',
      },
    ],
  },
}
