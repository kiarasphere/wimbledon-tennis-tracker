import { describe, expect, it } from 'vitest'
import type { PlayerStanding } from '../api'
import { filterStandingsByName } from './filterStandingsByName'

const standings: PlayerStanding[] = [
  {
    position: 1,
    position_start: 1,
    player_id: 1,
    full_name: 'Jannik Sinner',
    name_acronym: 'SIN',
    country: 'ITA',
    country_colour: '009246',
    photo_url: null,
    points: 13450,
    points_start: 13450,
  },
  {
    position: 2,
    position_start: 2,
    player_id: 2,
    full_name: 'Alexander Zverev',
    name_acronym: 'ZVE',
    country: 'GER',
    country_colour: 'FFCE00',
    photo_url: null,
    points: 8480,
    points_start: 8480,
  },
]

describe('filterStandingsByName', () => {
  it('returns all standings when query is empty or whitespace', () => {
    expect(filterStandingsByName(standings, '')).toEqual(standings)
    expect(filterStandingsByName(standings, '   ')).toEqual(standings)
  })

  it('matches player full name case-insensitively', () => {
    expect(filterStandingsByName(standings, 'sinner')).toEqual([standings[0]])
    expect(filterStandingsByName(standings, 'ALEX')).toEqual([standings[1]])
  })

  it('matches player acronym', () => {
    expect(filterStandingsByName(standings, 'zve')).toEqual([standings[1]])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterStandingsByName(standings, 'nadal')).toEqual([])
  })
})
