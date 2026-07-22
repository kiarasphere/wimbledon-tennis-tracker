export interface NameSearchablePlayer {
  full_name: string | null
  name_acronym: string | null
}

/** Case-insensitive substring match on player full name or acronym. */
export function filterPlayersByName<T extends NameSearchablePlayer>(
  players: T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return players
  }

  return players.filter((player) => {
    const name = player.full_name?.toLowerCase() ?? ''
    const acronym = player.name_acronym?.toLowerCase() ?? ''
    return name.includes(normalized) || acronym.includes(normalized)
  })
}
