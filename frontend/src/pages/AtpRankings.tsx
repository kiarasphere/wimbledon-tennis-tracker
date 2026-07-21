import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAtpRankings } from '../api'
import type { PlayerStanding, PlayerRankingsResponse } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { FavoriteStar } from '../components/FavoriteStar'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PointsDelta,
  PlayerCell,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'

const columns: StandingsColumn<PlayerStanding>[] = [
  {
    key: 'favorite',
    header: '',
    className: 'col-fav',
    render: (row) => (
      <FavoriteStar
        playerId={row.player_id}
        playerName={row.full_name ?? `Player ${row.player_id}`}
      />
    ),
  },
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
    key: 'points',
    header: 'Points',
    className: 'col-points',
    sortable: true,
    render: (row) => <PointsDelta points={row.points} pointsStart={row.points_start} />,
  },
]

export function AtpRankings() {
  const [data, setData] = useState<PlayerRankingsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadRankings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchAtpRankings()
      setData(response)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load ATP rankings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRankings()
  }, [loadRankings])

  return (
    <section className="page">
      <ContextHeader title="ATP Rankings" context={data?.context ?? null} />
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadRankings} /> : null}
      {!loading && !error && data ? (
        <StandingsTable
          columns={columns}
          rows={data.standings}
          rowKey={(row) => row.player_id}
        />
      ) : null}
    </section>
  )
}
