import { describe, expect, it } from 'vitest'
import type { PlayerStanding } from '../api'
import { filterPlayerStandings } from './filterPlayerStandings'

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
    position_start: 3,
    player_id: 2,
    full_name: 'Alexander Zverev',
    name_acronym: 'ZVE',
    country: 'GER',
    country_colour: 'FFCE00',
    photo_url: null,
    points: 8480,
    points_start: 7190,
  },
]

describe('filterPlayerStandings', () => {
  it('returns all rows when the query is empty or whitespace', () => {
    expect(filterPlayerStandings(standings, '')).toEqual(standings)
    expect(filterPlayerStandings(standings, '   ')).toEqual(standings)
  })

  it('matches full_name case-insensitively', () => {
    expect(filterPlayerStandings(standings, 'sinner')).toEqual([standings[0]])
    expect(filterPlayerStandings(standings, 'ALEX')).toEqual([standings[1]])
  })

  it('matches name_acronym', () => {
    expect(filterPlayerStandings(standings, 'zve')).toEqual([standings[1]])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterPlayerStandings(standings, 'nadal')).toEqual([])
  })
})
