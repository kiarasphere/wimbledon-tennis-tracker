import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWimbledonResults } from '../api'
import type { TournamentResult, TournamentResultsResponse } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PlayerCell,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'

function ResultStatus({ row }: { row: TournamentResult }) {
  if (row.walkover) {
    return <span className="status-badge status-dns">W/O</span>
  }
  if (row.retired) {
    return <span className="status-badge status-dnf">RET</span>
  }
  return null
}

const columns: StandingsColumn<TournamentResult>[] = [
  {
    key: 'position',
    header: 'Pos',
    className: 'col-pos',
    render: (row) => <PositionBadge position={row.position} />,
  },
  {
    key: 'player',
    header: 'Player',
    render: (row) => (
      <Link to={`/players/${row.player_id}`} className="driver-cell driver-link">
        <PlayerCell
          playerId={row.player_id}
          fullName={row.full_name}
          nameAcronym={row.name_acronym}
          photoUrl={row.photo_url}
        />
      </Link>
    ),
  },
  {
    key: 'country',
    header: 'Country',
    render: (row) => <CountryBadge country={row.country} countryColour={row.country_colour} />,
  },
  {
    key: 'seed',
    header: 'Seed',
    className: 'col-pos',
    render: (row) => (
      <span className="gap-value">{row.seed != null ? `[${row.seed}]` : '—'}</span>
    ),
  },
  {
    key: 'round',
    header: 'Round',
    render: (row) => <span className="primary-label">{row.round_reached ?? '—'}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    className: 'col-status',
    render: (row) => <ResultStatus row={row} />,
  },
]

export function WimbledonResults() {
  const [data, setData] = useState<TournamentResultsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadResults = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWimbledonResults()
      setData(response)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load Wimbledon results')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadResults()
  }, [loadResults])

  const subtitle = data?.context
    ? `${data.context.year} · ${data.context.tournament_name ?? 'Wimbledon'} Men's Singles`
    : undefined

  return (
    <section className="page">
      <ContextHeader
        title="Wimbledon Results"
        context={data?.context ?? null}
        eyebrow="Grand Slam"
        subtitle={subtitle}
      />
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadResults} /> : null}
      {!loading && !error && data ? (
        <StandingsTable
          columns={columns}
          rows={data.results}
          rowKey={(row) => row.player_id}
        />
      ) : null}
    </section>
  )
}
