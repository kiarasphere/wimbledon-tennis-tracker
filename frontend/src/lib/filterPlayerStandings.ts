import type { PlayerStanding } from '../api'

/** Case-insensitive substring match on full_name or name_acronym. */
export function filterPlayerStandings(
  standings: PlayerStanding[],
  query: string,
): PlayerStanding[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return standings
  }

  return standings.filter((row) => {
    const fullName = row.full_name?.toLowerCase() ?? ''
    const acronym = row.name_acronym?.toLowerCase() ?? ''
    return fullName.includes(normalized) || acronym.includes(normalized)
  })
}
