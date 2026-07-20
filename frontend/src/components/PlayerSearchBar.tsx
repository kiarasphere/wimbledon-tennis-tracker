interface PlayerSearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function PlayerSearchBar({
  value,
  onChange,
  resultCount,
  totalCount,
}: PlayerSearchBarProps) {
  const trimmed = value.trim()

  return (
    <div className="player-search">
      <label className="player-search-label" htmlFor="player-search">
        Search players
      </label>
      <div className="player-search-controls">
        <input
          id="player-search"
          className="player-search-input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by player name…"
          autoComplete="off"
          spellCheck={false}
        />
        {trimmed ? (
          <p className="player-search-meta" aria-live="polite">
            {resultCount} of {totalCount}
          </p>
        ) : null}
      </div>
    </div>
  )
}
