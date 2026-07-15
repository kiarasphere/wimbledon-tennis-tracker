import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFinalMatch } from '../api'
import type { FinalMatchResponse } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { CountryBadge } from '../components/StandingsTable'

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function FinalMatch() {
  const [data, setData] = useState<FinalMatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMatch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFinalMatch()
      setData(response)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load final match data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMatch()
  }, [loadMatch])

  const match = data?.match

  return (
    <section className="page">
      <ContextHeader
        title="Wimbledon Final"
        context={data?.context ?? null}
        eyebrow="Match Stats"
        subtitle={
          match
            ? `${match.tournament} · ${match.venue} · ${formatDuration(match.duration_minutes)}`
            : undefined
        }
      />
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadMatch} /> : null}
      {!loading && !error && match ? (
        <>
          <div className="match-scoreboard">
            <div className="match-player match-winner">
              <Link to={`/players/${match.winner.player_id}`} className="driver-link">
                <div className="driver-headshot placeholder">{match.winner.name_acronym}</div>
                <div>
                  <div className="primary-label">{match.winner.full_name}</div>
                  <CountryBadge
                    country={match.winner.country}
                    countryColour={match.winner.country_colour}
                  />
                  {match.winner.seed != null ? (
                    <span className="secondary-label">Seed [{match.winner.seed}]</span>
                  ) : null}
                </div>
              </Link>
            </div>
            <div className="match-score">
              <span className="match-score-label">Final Score</span>
              <span className="match-score-value">{match.score}</span>
              <span className="match-score-surface">{match.surface} · {match.date}</span>
            </div>
            <div className="match-player match-runner-up">
              <Link to={`/players/${match.runner_up.player_id}`} className="driver-link">
                <div className="driver-headshot placeholder">{match.runner_up.name_acronym}</div>
                <div>
                  <div className="primary-label">{match.runner_up.full_name}</div>
                  <CountryBadge
                    country={match.runner_up.country}
                    countryColour={match.runner_up.country_colour}
                  />
                  {match.runner_up.seed != null ? (
                    <span className="secondary-label">Seed [{match.runner_up.seed}]</span>
                  ) : null}
                </div>
              </Link>
            </div>
          </div>

          <div className="set-scores">
            <h2>Set scores</h2>
            <div className="set-scores-grid">
              {match.sets.map((set) => (
                <div key={set.set} className="set-score-card">
                  <span className="set-label">Set {set.set}</span>
                  <span className="set-value">
                    {set.winner_games}
                    {set.tiebreak ? `(${set.winner_tb})` : ''}
                    {' – '}
                    {set.runner_up_games}
                    {set.tiebreak ? `(${set.runner_up_tb})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-comparison">
            <h2>Match statistics</h2>
            <table className="standings-table stats-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>{match.winner.name_acronym}</th>
                  <th>{match.runner_up.name_acronym}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aces</td>
                  <td>{match.stats.winner.aces}</td>
                  <td>{match.stats.runner_up.aces}</td>
                </tr>
                <tr>
                  <td>Double faults</td>
                  <td>{match.stats.winner.double_faults}</td>
                  <td>{match.stats.runner_up.double_faults}</td>
                </tr>
                <tr>
                  <td>Winners</td>
                  <td>{match.stats.winner.winners}</td>
                  <td>{match.stats.runner_up.winners}</td>
                </tr>
                <tr>
                  <td>Unforced errors</td>
                  <td>{match.stats.winner.unforced_errors}</td>
                  <td>{match.stats.runner_up.unforced_errors}</td>
                </tr>
                <tr>
                  <td>1st serve %</td>
                  <td>{match.stats.winner.first_serve_pct}%</td>
                  <td>{match.stats.runner_up.first_serve_pct}%</td>
                </tr>
                <tr>
                  <td>Break points saved</td>
                  <td>{match.stats.winner.break_points_saved}</td>
                  <td>{match.stats.runner_up.break_points_saved}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="match-highlights">
            <h2>Key moments</h2>
            <ol className="highlights-list">
              {match.highlights.map((highlight) => (
                <li key={highlight.time} className="highlight-item">
                  <span className="highlight-time">{highlight.time}</span>
                  <span className="highlight-desc">{highlight.description}</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : null}
    </section>
  )
}
