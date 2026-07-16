/**
 * Response types for `/api/*` data routes.
 * Aligned with `backend/app/schemas.py`.
 */

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

const DEFAULT_FETCH_TIMEOUT_MS = 10_000

function errorMessageFromBody(body: string, status: number): string {
  const fallback = `Request failed with status ${status}`
  if (!body) {
    return fallback
  }
  try {
    const parsed = JSON.parse(body) as { detail?: unknown }
    if (typeof parsed.detail === 'string' && parsed.detail.trim()) {
      return parsed.detail
    }
  } catch {
    // Non-JSON error bodies fall through to the raw text.
  }
  return body
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException
    ? err.name === 'AbortError'
    : err instanceof Error && err.name === 'AbortError'
}

async function fetchJson<T>(path: string, options?: FetchOptions): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  const onExternalAbort = () => controller.abort()
  options?.signal?.addEventListener('abort', onExternalAbort)

  try {
    const response = await fetch(path, { signal: controller.signal })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(errorMessageFromBody(body, response.status))
    }
    return response.json() as Promise<T>
  } catch (err) {
    if (isAbortError(err)) {
      if (options?.signal?.aborted) {
        throw err
      }
      throw new Error('Request timed out — try again in a moment')
    }
    throw err
  } finally {
    window.clearTimeout(timeoutId)
    options?.signal?.removeEventListener('abort', onExternalAbort)
  }
}

export function fetchAtpRankings(options?: FetchOptions): Promise<PlayerRankingsResponse> {
  return fetchJson<PlayerRankingsResponse>('/api/rankings/atp', options)
}

export function fetchWtaRankings(options?: FetchOptions): Promise<PlayerRankingsResponse> {
  return fetchJson<PlayerRankingsResponse>('/api/rankings/wta', options)
}

export function fetchCountryRankings(options?: FetchOptions): Promise<CountryRankingsResponse> {
  return fetchJson<CountryRankingsResponse>('/api/rankings/countries', options)
}

export function fetchLatestResults(options?: FetchOptions): Promise<TournamentResultsResponse> {
  return fetchJson<TournamentResultsResponse>('/api/results/latest', options)
}

export function fetchPlayerSeason(
  playerId: number,
  options?: FetchOptions,
): Promise<PlayerSeasonResponse> {
  return fetchJson<PlayerSeasonResponse>(`/api/players/${playerId}/season`, options)
}

export function fetchFinalMatch(options?: FetchOptions): Promise<FinalMatchResponse> {
  return fetchJson<FinalMatchResponse>('/api/match/final', options)
}

export { isAbortError }
