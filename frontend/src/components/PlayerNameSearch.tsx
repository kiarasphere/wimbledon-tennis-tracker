interface PlayerNameSearchProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function PlayerNameSearch({
  value,
  onChange,
  id = 'player-name-search',
}: PlayerNameSearchProps) {
  return (
    <div className="player-search">
      <label htmlFor={id} className="player-search-label">
        Search players
      </label>
      <input
        id={id}
        type="search"
        className="player-search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter by player name"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}
