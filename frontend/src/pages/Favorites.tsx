import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAtpRankings, fetchWtaRankings, isAbortError } from '../api'
import type { PlayerStanding, SeasonContext } from '../api'
import { ContextHeader } from '../components/ContextHeader'
import { ErrorState } from '../components/ErrorState'
import { FavoriteStar } from '../components/FavoriteStar'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PlayerCell,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteRow extends PlayerStanding {
  tour: 'ATP' | 'WTA' | null
}

const columns: StandingsColumn<FavoriteRow>[] = [
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
    render: (row) =>
      row.position > 0 ? <PositionBadge position={row.position} /> : <span>—</span>,
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
    key: 'tour',
    header: 'Tour',
    className: 'col-pos',
    render: (row) => <span className="gap-value">{row.tour ?? '—'}</span>,
  },
  {
    key: 'country',
    header: 'Country',
    render: (row) => <CountryBadge country={row.country} countryColour={row.country_colour} />,
  },
]

function standingLookup(standings: PlayerStanding[], tour: 'ATP' | 'WTA'): Map<number, FavoriteRow> {
  const map = new Map<number, FavoriteRow>()
  for (const row of standings) {
    map.set(row.player_id, { ...row, tour })
  }
  return map
}

export function Favorites() {
  const { favoriteIds } = useFavorites()
  const [playersById, setPlayersById] = useState<Map<number, FavoriteRow>>(new Map())
  const [context, setContext] = useState<SeasonContext | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const loadFavoritesData = useCallback(async (signal: AbortSignal) => {
    setLoading(true)
    setError(null)

    try {
      const [atp, wta] = await Promise.all([
        fetchAtpRankings({ signal }),
        fetchWtaRankings({ signal }),
      ])
      if (signal.aborted) return
      const merged = new Map<number, FavoriteRow>([
        ...standingLookup(atp.standings, 'ATP'),
        ...standingLookup(wta.standings, 'WTA'),
      ])
      setPlayersById(merged)
      setContext(atp.context)
    } catch (err) {
      if (isAbortError(err) || signal.aborted) return
      setPlayersById(new Map())
      setContext(null)
      setError(err instanceof Error ? err.message : 'Failed to load favorites')
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadFavoritesData(controller.signal)
    return () => controller.abort()
  }, [loadFavoritesData, reloadKey])

  const rows = favoriteIds.map((playerId) => {
    const known = playersById.get(playerId)
    if (known) return known
    return {
      position: 0,
      position_start: 0,
      player_id: playerId,
      full_name: `Player ${playerId}`,
      name_acronym: null,
      country: null,
      country_colour: null,
      photo_url: null,
      points: 0,
      points_start: 0,
      tour: null,
    } satisfies FavoriteRow
  })

  const retry = () => setReloadKey((key) => key + 1)

  return (
    <section className="page">
      <ContextHeader title="Favorites" context={context} eyebrow="Your shortlist" />
      {loading ? <LoadingState message="Loading favorites…" /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={retry} /> : null}
      {!loading && !error ? (
        <StandingsTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.player_id}
          emptyMessage="No favorite players yet. Star someone on the ATP or WTA rankings to see them here."
        />
      ) : null}
    </section>
  )
}
