/**
 * Local data access for Tennis Tracker.
 * Snapshot sourced from `backend/app/tennis_data.py` (15 July 2026).
 * No network calls — safe for static Vercel deploys.
 */

import snapshot from './data/snapshot.json' with { type: 'json' }

export interface SeasonContext {
  year: number
  tournament_id: number
  tournament_name: string | null
  tournament_official_name: string | null
  country_name: string | null
  location: string | null
  surface: string | null
  event_name: string | null
  date_start: string | null
}

export interface PlayerStanding {
  position: number
  position_start: number
  player_id: number
  full_name: string | null
  name_acronym: string | null
  country: string | null
  country_colour: string | null
  photo_url: string | null
  points: number
  points_start: number
}

export interface PlayerRankingsResponse {
  context: SeasonContext
  standings: PlayerStanding[]
}

export interface CountryStanding {
  position: number
  position_start: number
  country: string
  country_colour: string | null
  points: number
  points_start: number
  player_count: number
}

export interface CountryRankingsResponse {
  context: SeasonContext
  standings: CountryStanding[]
}

export interface TournamentResult {
  position: number
  seed: number | null
  player_id: number
  full_name: string | null
  name_acronym: string | null
  country: string | null
  country_colour: string | null
  photo_url: string | null
  round_reached: string | null
  score: string | null
  retired: boolean
  walkover: boolean
}

export interface TournamentResultsResponse {
  context: SeasonContext
  results: TournamentResult[]
}

export interface PlayerProfile {
  player_id: number
  full_name: string | null
  name_acronym: string | null
  country: string | null
  country_colour: string | null
  photo_url: string | null
}

export interface PlayerSeasonSummary {
  titles: number
  grand_slams: number
  best_result: string | null
  best_result_tournament: string | null
  matches_won: number
  matches_lost: number
  win_pct: number
}

export interface PlayerSeasonRound {
  round: number
  tournament_id: number
  tournament_name: string | null
  date_start: string | null
  surface: string | null
  ranking_points: number | null
  ranking_position: number | null
  seed: number | null
  result: string | null
  opponent: string | null
}

export interface PlayerSeasonResponse {
  context: SeasonContext
  player: PlayerProfile
  summary: PlayerSeasonSummary
  trajectory: PlayerSeasonRound[]
}

export interface MatchPlayer {
  player_id: number
  full_name: string | null
  name_acronym: string | null
  country: string | null
  country_colour: string | null
  seed: number | null
}

export interface MatchSet {
  set: number
  winner_games: number
  runner_up_games: number
  tiebreak: boolean
  winner_tb: number | null
  runner_up_tb: number | null
}

export interface MatchPlayerStats {
  aces: number
  double_faults: number
  winners: number
  unforced_errors: number
  first_serve_pct: number
  break_points_saved: string
}

export interface MatchHighlight {
  time: string
  description: string
}

export interface FinalMatch {
  tournament: string
  surface: string
  date: string
  venue: string
  duration_minutes: number
  winner: MatchPlayer
  runner_up: MatchPlayer
  score: string
  sets: MatchSet[]
  stats: {
    winner: MatchPlayerStats
    runner_up: MatchPlayerStats
  }
  highlights: MatchHighlight[]
}

export interface FinalMatchResponse {
  context: SeasonContext
  match: FinalMatch
}

export interface FetchOptions {
  signal?: AbortSignal
  timeoutMs?: number
}

const data = snapshot as {
  atpRankings: PlayerRankingsResponse
  wtaRankings: PlayerRankingsResponse
  countryRankings: CountryRankingsResponse
  latestResults: TournamentResultsResponse
  finalMatch: FinalMatchResponse
  playerSeasons: Record<string, PlayerSeasonResponse>
  atpPlayerProfiles: Record<string, PlayerProfile>
  context: SeasonContext
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException
    ? err.name === 'AbortError'
    : err instanceof Error && err.name === 'AbortError'
}

function assertNotAborted(options?: FetchOptions): void {
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }
}

async function resolveLocal<T>(value: T, options?: FetchOptions): Promise<T> {
  assertNotAborted(options)
  return value
}

type RankingsCacheKey = 'atp' | 'wta'

const rankingsCache = new Map<RankingsCacheKey, PlayerRankingsResponse>()
const rankingsInflight = new Map<RankingsCacheKey, Promise<PlayerRankingsResponse>>()

async function fetchCachedRankings(
  key: RankingsCacheKey,
  value: PlayerRankingsResponse,
  options?: FetchOptions,
): Promise<PlayerRankingsResponse> {
  assertNotAborted(options)

  const cached = rankingsCache.get(key)
  if (cached) {
    return cached
  }

  const inflight = rankingsInflight.get(key)
  if (inflight) {
    return inflight
  }

  const request = resolveLocal(value, options)
    .then((resolved) => {
      rankingsCache.set(key, resolved)
      rankingsInflight.delete(key)
      return resolved
    })
    .catch((err) => {
      rankingsInflight.delete(key)
      throw err
    })

  rankingsInflight.set(key, request)
  return request
}

/** Clears in-memory ATP/WTA rankings cache (used by tests). */
export function clearRankingsCache(): void {
  rankingsCache.clear()
  rankingsInflight.clear()
}

export function fetchAtpRankings(options?: FetchOptions): Promise<PlayerRankingsResponse> {
  return fetchCachedRankings('atp', data.atpRankings, options)
}

export function fetchWtaRankings(options?: FetchOptions): Promise<PlayerRankingsResponse> {
  return fetchCachedRankings('wta', data.wtaRankings, options)
}

export function fetchCountryRankings(options?: FetchOptions): Promise<CountryRankingsResponse> {
  return resolveLocal(data.countryRankings, options)
}

export function fetchLatestResults(options?: FetchOptions): Promise<TournamentResultsResponse> {
  return resolveLocal(data.latestResults, options)
}

export function fetchFinalMatch(options?: FetchOptions): Promise<FinalMatchResponse> {
  return resolveLocal(data.finalMatch, options)
}

export async function fetchPlayerSeason(
  playerId: number,
  options?: FetchOptions,
): Promise<PlayerSeasonResponse> {
  assertNotAborted(options)

  const season = data.playerSeasons[String(playerId)]
  if (season) {
    return season
  }

  const profile = data.atpPlayerProfiles[String(playerId)]
  if (profile) {
    return {
      context: data.context,
      player: profile,
      summary: {
        titles: 0,
        grand_slams: 0,
        best_result: null,
        best_result_tournament: null,
        matches_won: 0,
        matches_lost: 0,
        win_pct: 0,
      },
      trajectory: [],
    }
  }

  throw new Error('Player not found')
}

export { isAbortError }
