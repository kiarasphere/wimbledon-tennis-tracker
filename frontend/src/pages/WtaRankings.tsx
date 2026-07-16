import { useCallback, useEffect, useState } from 'react'
import { fetchWtaRankings } from '../api'
import type { PlayerStanding, PlayerRankingsResponse } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PlayerNameSearch } from '../components/PlayerNameSearch'
import {
  CountryBadge,
  PointsDelta,
  PlayerCell,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'
import { usePlayerNameSearch } from '../hooks/usePlayerNameSearch'

const columns: StandingsColumn<PlayerStanding>[] = [
  {
    key: 'position',
    header: 'Rank',
    className: 'col-pos',
    sortable: true,
    render: (row) => <PositionBadge position={row.position} />,
  },
  {
    key: 'player',
    header: 'Player',
    render: (row) => (
      <div className="driver-cell">
        <PlayerCell
          playerId={row.player_id}
          fullName={row.full_name}
          nameAcronym={row.name_acronym}
          photoUrl={row.photo_url}
        />
      </div>
    ),
  },
  {
    key: 'country',
    header: 'Country',
    render: (row) => <CountryBadge country={row.country} countryColour={row.country_colour} />,
  },
  {
    key: 'points',
    header: 'Points',
    className: 'col-points',
    sortable: true,
    render: (row) => <PointsDelta points={row.points} pointsStart={row.points_start} />,
  },
]

export function WtaRankings() {
  const [data, setData] = useState<PlayerRankingsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { query, setQuery, filtered } = usePlayerNameSearch(data?.standings ?? [])

  const loadRankings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWtaRankings()
      setData(response)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load WTA rankings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRankings()
  }, [loadRankings])

  const emptyMessage = query.trim()
    ? `No players match “${query.trim()}”.`
    : 'No data available yet.'

  return (
    <section className="page">
      <ContextHeader title="WTA Rankings" context={data?.context ?? null} eyebrow="Women's Tennis" />
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadRankings} /> : null}
      {!loading && !error && data ? (
        <>
          <PlayerNameSearch value={query} onChange={setQuery} id="wta-player-search" />
          <StandingsTable
            columns={columns}
            rows={filtered}
            rowKey={(row) => row.player_id}
            emptyMessage={emptyMessage}
          />
        </>
      ) : null}
    </section>
  )
}
