import { describe, expect, it } from 'vitest'
import { filterPlayerStandings } from './filterPlayerStandings'

const standings = [
  { full_name: 'Jannik Sinner', name_acronym: 'SIN' },
  { full_name: 'Alexander Zverev', name_acronym: 'ZVE' },
  { full_name: null, name_acronym: null },
]

describe('filterPlayerStandings', () => {
  it('returns all rows when query is empty or whitespace', () => {
    expect(filterPlayerStandings(standings, '')).toEqual(standings)
    expect(filterPlayerStandings(standings, '   ')).toEqual(standings)
  })

  it('filters by case-insensitive full_name substring', () => {
    expect(filterPlayerStandings(standings, 'sinner')).toEqual([standings[0]])
    expect(filterPlayerStandings(standings, 'ALEX')).toEqual([standings[1]])
  })

  it('also matches name_acronym', () => {
    expect(filterPlayerStandings(standings, 'zve')).toEqual([standings[1]])
  })

  it('returns empty list when nothing matches', () => {
    expect(filterPlayerStandings(standings, 'nadal')).toEqual([])
  })
})
