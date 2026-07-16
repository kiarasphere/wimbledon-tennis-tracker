import type { PlayerStanding } from '../api'

/** Case-insensitive substring match on player full name or acronym. */
export function filterStandingsByName(
  standings: PlayerStanding[],
  query: string,
): PlayerStanding[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return standings
  }

  return standings.filter((row) => {
    const name = row.full_name?.toLowerCase() ?? ''
    const acronym = row.name_acronym?.toLowerCase() ?? ''
    return name.includes(normalized) || acronym.includes(normalized)
  })
}
