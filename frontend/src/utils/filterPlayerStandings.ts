export interface NameSearchable {
  full_name: string | null
  name_acronym: string | null
}

/** Case-insensitive substring match on full_name and name_acronym. */
export function filterPlayerStandings<T extends NameSearchable>(
  standings: T[],
  query: string,
): T[] {
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
