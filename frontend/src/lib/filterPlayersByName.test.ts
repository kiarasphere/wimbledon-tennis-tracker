import { describe, expect, it } from 'vitest'
import { filterPlayersByName } from './filterPlayersByName'

const players = [
  {
    player_id: 1,
    full_name: 'Jannik Sinner',
    name_acronym: 'SIN',
    tour: 'ATP' as const,
  },
  {
    player_id: 2,
    full_name: 'Alexander Zverev',
    name_acronym: 'ZVE',
    tour: 'ATP' as const,
  },
  {
    player_id: 101,
    full_name: 'Aryna Sabalenka',
    name_acronym: 'SAB',
    tour: 'WTA' as const,
  },
]

describe('filterPlayersByName', () => {
  it('returns all players when query is empty or whitespace', () => {
    expect(filterPlayersByName(players, '')).toEqual(players)
    expect(filterPlayersByName(players, '   ')).toEqual(players)
  })

  it('matches player full name case-insensitively', () => {
    expect(filterPlayersByName(players, 'sinner')).toEqual([players[0]])
    expect(filterPlayersByName(players, 'ARYNA')).toEqual([players[2]])
  })

  it('matches player acronym', () => {
    expect(filterPlayersByName(players, 'zve')).toEqual([players[1]])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterPlayersByName(players, 'nadal')).toEqual([])
  })
})
