interface PlayerSearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
  totalCount?: number
}

export function PlayerSearchBar({
  value,
  onChange,
  resultCount,
  totalCount,
}: PlayerSearchBarProps) {
  const showCount =
    value.trim().length > 0 && resultCount != null && totalCount != null

  return (
    <div className="player-search">
      <label className="player-search-label" htmlFor="player-search-input">
        Search players
      </label>
      <div className="player-search-field">
        <svg
          className="player-search-icon"
          viewBox="0 0 20 20"
          width="18"
          height="18"
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
          id="player-search-input"
          type="search"
          className="player-search-input"
          placeholder="Search by player name…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {value ? (
          <button
            type="button"
            className="player-search-clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        ) : null}
      </div>
      {showCount ? (
        <p className="player-search-meta" aria-live="polite">
          Showing {resultCount} of {totalCount}
        </p>
      ) : null}
    </div>
  )
}
