import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPlayerSeason, isAbortError } from '../api'
import type { PlayerSeasonResponse, PlayerSeasonRound } from '../api'
import { ErrorState } from '../components/ErrorState'
import { FavoriteButton } from '../components/FavoriteButton'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'

function TrajectorySparkline({ rounds }: { rounds: PlayerSeasonRound[] }) {
  if (rounds.length === 0) {
    return null
  }

  const width = 640
  const height = 180
  const padding = 28
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = rounds
    .map((round) => round.ranking_points)
    .filter((value): value is number => value != null)
  const positions = rounds
    .map((round) => round.ranking_position)
    .filter((value): value is number => value != null)

  const maxPoints = Math.max(...points, 1)
  const maxPosition = Math.max(...positions, 1)
  const maxRound = Math.max(...rounds.map((round) => round.round))

  const roundToX = (roundNumber: number) =>
    padding + ((roundNumber - 1) / Math.max(maxRound - 1, 1)) * chartWidth

  const pointCoords = rounds.map((round) => {
    const x = roundToX(round.round)
    const y =
      round.ranking_points == null
        ? null
        : padding + chartHeight - (round.ranking_points / maxPoints) * chartHeight
    return { x, y }
  })

  const positionCoords = rounds.map((round) => {
    const x = roundToX(round.round)
    const y =
      round.ranking_position == null
        ? null
        : padding + ((round.ranking_position - 1) / Math.max(maxPosition - 1, 1)) * chartHeight
    return { x, y }
  })

  const pointsPath = pointCoords
    .filter((coord) => coord.y != null)
    .map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
    .join(' ')

  const positionPath = positionCoords
    .filter((coord) => coord.y != null)
    .map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
    .join(' ')

  return (
    <div className="trajectory-chart">
      <div className="trajectory-chart-header">
        <h2>Season trajectory</h2>
        <div className="trajectory-legend">
          <span className="legend-item legend-points">Ranking points</span>
          <span className="legend-item legend-position">Ranking position</span>
        </div>
      </div>
      <svg
        className="trajectory-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Season trajectory chart showing ranking points and position by tournament"
      >
        <line
          x1={padding}
          y1={padding + chartHeight}
          x2={padding + chartWidth}
          y2={padding + chartHeight}
          className="trajectory-axis"
        />
        {pointsPath ? <path d={pointsPath} className="trajectory-line trajectory-line-points" /> : null}
        {positionPath ? (
          <path d={positionPath} className="trajectory-line trajectory-line-position" />
        ) : null}
        {pointCoords.map((coord, index) =>
          coord.y == null ? null : (
            <circle
              key={`points-${rounds[index].round}`}
              cx={coord.x}
              cy={coord.y}
              r={4}
              className="trajectory-dot trajectory-dot-points"
            />
          ),
        )}
        {positionCoords.map((coord, index) =>
          coord.y == null ? null : (
            <circle
              key={`position-${rounds[index].round}`}
              cx={coord.x}
              cy={coord.y}
              r={4}
              className="trajectory-dot trajectory-dot-position"
            />
          ),
        )}
      </svg>
    </div>
  )
}

const roundColumns: StandingsColumn<PlayerSeasonRound>[] = [
  {
    key: 'round',
    header: '#',
    className: 'col-pos',
    render: (row) => <span className="round-label">{row.round}</span>,
  },
  {
    key: 'tournament',
    header: 'Tournament',
    render: (row) => <span className="primary-label">{row.tournament_name ?? '—'}</span>,
  },
  {
    key: 'surface',
    header: 'Surface',
    className: 'col-pos',
    render: (row) => <span className="gap-value">{row.surface ?? '—'}</span>,
  },
  {
    key: 'seed',
    header: 'Seed',
    className: 'col-pos',
    render: (row) =>
      row.seed != null ? <PositionBadge position={row.seed} /> : <span>—</span>,
  },
  {
    key: 'result',
    header: 'Result',
    render: (row) => <span className="primary-label">{row.result ?? '—'}</span>,
  },
  {
    key: 'opponent',
    header: 'Opponent',
    render: (row) => <span className="gap-value">{row.opponent ?? '—'}</span>,
  },
  {
    key: 'ranking',
    header: 'Rank',
    className: 'col-pos',
    render: (row) =>
      row.ranking_position != null ? (
        <PositionBadge position={row.ranking_position} />
      ) : (
        <span>—</span>
      ),
  },
]

export function PlayerProfile() {
  const { playerId } = useParams()
  const parsedPlayerId = Number(playerId)
  const [data, setData] = useState<PlayerSeasonResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadProfile() {
      if (!Number.isFinite(parsedPlayerId)) {
        if (!active) return
        setData(null)
        setError('Invalid player ID')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetchPlayerSeason(parsedPlayerId, {
          signal: controller.signal,
        })
        if (!active) return
        setData(response)
      } catch (err) {
        if (!active || isAbortError(err)) return
        setData(null)
        setError(err instanceof Error ? err.message : 'Failed to load player profile')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadProfile()

    return () => {
      active = false
      controller.abort()
    }
  }, [parsedPlayerId, reloadKey])

  const retry = () => setReloadKey((key) => key + 1)
  const playerName = data?.player.full_name ?? `Player ${parsedPlayerId}`

  return (
    <section className="page driver-profile-page">
      <div className="profile-top">
        <Link to="/atp" className="back-link">
          ← Back to rankings
        </Link>
      </div>

      {loading ? <LoadingState message="Loading player profile…" /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={retry} /> : null}

      {!loading && !error && data ? (
        <>
          <header className="profile-header">
            <div className="profile-identity">
              {data.player.photo_url ? (
                <img
                  src={data.player.photo_url}
                  alt={playerName}
                  className="driver-headshot profile-headshot"
                  loading="lazy"
                />
              ) : (
                <div className="driver-headshot profile-headshot placeholder">
                  {data.player.name_acronym ?? data.player.player_id}
                </div>
              )}
              <div>
                <p className="eyebrow">Player profile</p>
                <div className="profile-title-row">
                  <h1>{playerName}</h1>
                  <FavoriteButton
                    playerId={data.player.player_id}
                    playerName={data.player.full_name}
                    className="favorite-button-lg"
                  />
                </div>
                <p className="subtitle">
                  {data.player.name_acronym} · {data.context.year} season
                </p>
                <CountryBadge
                  country={data.player.country}
                  countryColour={data.player.country_colour}
                />
              </div>
            </div>
          </header>

          <div className="summary-strip">
            <div className="summary-card">
              <span className="summary-label">Best result</span>
              <span className="summary-value">{data.summary.best_result ?? '—'}</span>
              <span className="summary-detail">
                {data.summary.best_result_tournament ?? 'No results yet'}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Win rate</span>
              <span className="summary-value">{data.summary.win_pct.toFixed(1)}%</span>
              <span className="summary-detail">
                {data.summary.matches_won}W – {data.summary.matches_lost}L
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Titles</span>
              <span className="summary-value">{data.summary.titles}</span>
              <span className="summary-detail">
                {data.summary.grand_slams} Grand Slam{data.summary.grand_slams !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <TrajectorySparkline rounds={data.trajectory} />

          <div className="round-table-section">
            <h2>Tournament by tournament</h2>
            <StandingsTable
              columns={roundColumns}
              rows={data.trajectory}
              rowKey={(row) => row.tournament_id}
              emptyMessage="No tournament data available for this player."
            />
          </div>
        </>
      ) : null}
    </section>
  )
}
