import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAtpRankings, fetchWtaRankings } from '../api'
import { filterPlayersByName } from '../lib/filterPlayersByName'

const DEBOUNCE_MS = 300
const MAX_RESULTS = 8

export interface NavSearchPlayer {
  player_id: number
  full_name: string | null
  name_acronym: string | null
  country: string | null
  tour: 'ATP' | 'WTA'
}

function toSearchPlayers(
  standings: {
    player_id: number
    full_name: string | null
    name_acronym: string | null
    country: string | null
  }[],
  tour: 'ATP' | 'WTA',
): NavSearchPlayer[] {
  return standings.map((row) => ({
    player_id: row.player_id,
    full_name: row.full_name,
    name_acronym: row.name_acronym,
    country: row.country,
    tour,
  }))
}

export function NavPlayerSearch() {
  const navigate = useNavigate()
  const inputId = useId()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [players, setPlayers] = useState<NavSearchPlayer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  async function ensurePlayersLoaded() {
    if (loadedRef.current || loading) {
      return
    }

    loadedRef.current = true
    setLoading(true)
    setError(null)

    try {
      const [atp, wta] = await Promise.all([fetchAtpRankings(), fetchWtaRankings()])
      setPlayers([
        ...toSearchPlayers(atp.standings, 'ATP'),
        ...toSearchPlayers(wta.standings, 'WTA'),
      ])
    } catch (err) {
      loadedRef.current = false
      setPlayers([])
      setError(err instanceof Error ? err.message : 'Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  const trimmedQuery = debouncedQuery.trim()
  const matches =
    trimmedQuery.length > 0 ? filterPlayersByName(players, debouncedQuery) : []
  const visibleMatches = matches.slice(0, MAX_RESULTS)
  const showPanel = open && trimmedQuery.length > 0

  function resetToIdle() {
    setQuery('')
    setDebouncedQuery('')
    setOpen(false)
  }

  function selectPlayer(player: NavSearchPlayer) {
    navigate(`/players/${player.player_id}`)
    resetToIdle()
  }

  return (
    <div className="nav-player-search" ref={rootRef}>
      <label className="nav-player-search-label" htmlFor={inputId}>
        Search players
      </label>
      <div className="nav-player-search-field">
        <svg
          className="nav-player-search-icon"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="8.5"
            cy="8.5"
            r="5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M12.75 12.75 16.5 16.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <input
          id={inputId}
          type="search"
          className="nav-player-search-input"
          placeholder="Search players…"
          value={query}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          onFocus={() => {
            setOpen(true)
            void ensurePlayersLoaded()
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
        />
        {query ? (
          <button
            type="button"
            className="nav-player-search-clear"
            onClick={resetToIdle}
            aria-label="Clear search"
          >
            Clear
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div className="nav-player-search-panel" id={listId} role="listbox">
          {loading && players.length === 0 ? (
            <p className="nav-player-search-status">Loading players…</p>
          ) : null}
          {!loading && error ? (
            <p className="nav-player-search-status" role="alert">
              {error}
            </p>
          ) : null}
          {!loading && !error && visibleMatches.length === 0 ? (
            <p className="nav-player-search-status">No players match.</p>
          ) : null}
          {!error && visibleMatches.length > 0 ? (
            <ul className="nav-player-search-results">
              {visibleMatches.map((player) => {
                const label = player.full_name ?? player.name_acronym ?? `Player ${player.player_id}`
                return (
                  <li key={`${player.tour}-${player.player_id}`}>
                    <button
                      type="button"
                      className="nav-player-search-result"
                      role="option"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectPlayer(player)}
                    >
                      <span className="nav-player-search-result-name">{label}</span>
                      <span className="nav-player-search-result-meta">
                        {player.tour}
                        {player.country ? ` · ${player.country}` : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
