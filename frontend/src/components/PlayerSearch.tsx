import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchPlayers } from '../api'
import type { PlayerSearchResult } from '../api'
import { CountryBadge, PlayerCell } from './StandingsTable'

const DEBOUNCE_MS = 300

export function PlayerSearch() {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const trimmedQuery = debouncedQuery.trim()
  const results = trimmedQuery ? searchPlayers(debouncedQuery) : []
  const showResults = open && trimmedQuery.length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [debouncedQuery])

  function selectPlayer(player: PlayerSearchResult) {
    setQuery('')
    setDebouncedQuery('')
    setOpen(false)
    navigate(`/players/${player.player_id}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (!showResults || results.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const player = results[activeIndex]
      if (player) {
        selectPlayer(player)
      }
    }
  }

  return (
    <div className="player-search" ref={containerRef}>
      <label className="player-search-label" htmlFor="player-search-input">
        Search players
      </label>
      <input
        id="player-search-input"
        type="search"
        className="player-search-input"
        placeholder="Search players…"
        value={query}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={showResults}
        aria-activedescendant={
          showResults && results[activeIndex] ? `${listboxId}-option-${results[activeIndex].player_id}` : undefined
        }
        role="combobox"
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showResults ? (
        <ul id={listboxId} className="player-search-results" role="listbox" aria-label="Player matches">
          {results.length === 0 ? (
            <li className="player-search-empty" role="presentation">
              No players match “{debouncedQuery.trim()}”
            </li>
          ) : (
            results.map((player, index) => (
              <li
                key={`${player.tour}-${player.player_id}`}
                id={`${listboxId}-option-${player.player_id}`}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'active' : undefined}
              >
                <Link
                  to={`/players/${player.player_id}`}
                  className="player-search-result"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={(event) => {
                    event.preventDefault()
                    selectPlayer(player)
                  }}
                >
                  <PlayerCell
                    playerId={player.player_id}
                    fullName={player.full_name}
                    nameAcronym={player.name_acronym}
                    photoUrl={player.photo_url}
                  />
                  <span className="player-search-meta">
                    <span className="player-search-tour">{player.tour}</span>
                    <CountryBadge country={player.country} countryColour={player.country_colour} />
                    <span className="player-search-rank">#{player.position}</span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
