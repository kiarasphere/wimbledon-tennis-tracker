import { useCallback, useEffect, useState } from 'react'
import { fetchCountryRankings } from '../api'
import type { CountryStanding, CountryRankingsResponse } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PointsDelta,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'

const columns: StandingsColumn<CountryStanding>[] = [
  {
    key: 'position',
    header: 'Rank',
    className: 'col-pos',
    render: (row) => <PositionBadge position={row.position} />,
  },
  {
    key: 'country',
    header: 'Country',
    render: (row) => <CountryBadge country={row.country} countryColour={row.country_colour} />,
  },
  {
    key: 'players',
    header: 'Players',
    className: 'col-pos',
    render: (row) => <span className="gap-value">{row.player_count}</span>,
  },
  {
    key: 'points',
    header: 'Total Points',
    className: 'col-points',
    render: (row) => <PointsDelta points={row.points} pointsStart={row.points_start} />,
  },
]

export function CountryRankings() {
  const [data, setData] = useState<CountryRankingsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadRankings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchCountryRankings()
      setData(response)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load country rankings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRankings()
  }, [loadRankings])

  return (
    <section className="page">
      <ContextHeader title="Country Rankings" context={data?.context ?? null} eyebrow="ATP Nations" />
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadRankings} /> : null}
      {!loading && !error && data ? (
        <StandingsTable
          columns={columns}
          rows={data.standings}
          rowKey={(row) => row.country}
        />
      ) : null}
    </section>
  )
}
