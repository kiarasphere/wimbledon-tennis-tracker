import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAtpRankings, fetchWtaRankings, isAbortError } from '../api'
import type { PlayerStanding } from '../api'
import { FavoriteButton } from '../components/FavoriteButton'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import {
  CountryBadge,
  PlayerCell,
  PositionBadge,
  StandingsTable,
  type StandingsColumn,
} from '../components/StandingsTable'
import { useFavorites } from '../favoritesContext'

interface FavoritePlayerRow extends PlayerStanding {
  tour: 'ATP' | 'WTA'
}

const columns: StandingsColumn<FavoritePlayerRow>[] = [
  {
    key: 'favorite',
    header: '',
    className: 'col-favorite',
    render: (row) => (
      <FavoriteButton playerId={row.player_id} playerName={row.full_name} />
    ),
  },
  {
    key: 'tour',
    header: 'Tour',
    className: 'col-tour',
    render: (row) => <span className="gap-value">{row.tour}</span>,
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
    key: 'country',
    header: 'Country',
    render: (row) => <CountryBadge country={row.country} countryColour={row.country_colour} />,
  },
]

export function Favorites() {
  const { favoriteIds } = useFavorites()
  const hasFavorites = favoriteIds.length > 0
  const [playersById, setPlayersById] = useState<Map<number, FavoritePlayerRow>>(new Map())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!hasFavorites) {
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    let active = true

    async function loadPlayers() {
      setLoading(true)
      setError(null)

      try {
        // One page-level load of existing rankings endpoints (no favorites API).
        const [atp, wta] = await Promise.all([
          fetchAtpRankings({ signal: controller.signal }),
          fetchWtaRankings({ signal: controller.signal }),
        ])
        if (!active) return

        const next = new Map<number, FavoritePlayerRow>()
        for (const row of atp.standings) {
          next.set(row.player_id, { ...row, tour: 'ATP' })
        }
        for (const row of wta.standings) {
          next.set(row.player_id, { ...row, tour: 'WTA' })
        }
        setPlayersById(next)
      } catch (err) {
        if (!active || isAbortError(err)) return
        setPlayersById(new Map())
        setError(err instanceof Error ? err.message : 'Failed to load favorites')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPlayers()

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadKey, hasFavorites])

  const rows: FavoritePlayerRow[] = favoriteIds.map((playerId) => {
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
      tour: 'ATP',
    }
  })

  const retry = () => setReloadKey((key) => key + 1)

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Your shortlist</p>
          <h1>Favorites</h1>
          <p className="subtitle">Players you have starred across ATP and WTA rankings.</p>
        </div>
      </header>

      {loading ? <LoadingState message="Loading favorites…" /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={retry} /> : null}
      {!loading && !error && favoriteIds.length === 0 ? (
        <div className="table-shell table-empty" role="status">
          <p className="table-empty-message">
            No favorites yet. Star a player on the ATP or WTA rankings to see them here.
          </p>
        </div>
      ) : null}
      {!loading && !error && favoriteIds.length > 0 ? (
        <StandingsTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.player_id}
          emptyMessage="No favorites yet."
        />
      ) : null}
    </section>
  )
}
