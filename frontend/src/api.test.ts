import { afterEach, describe, expect, it } from 'vitest'
import {
  clearRankingsCache,
  fetchAtpRankings,
  fetchFinalMatch,
  fetchPlayerSeason,
  fetchWtaRankings,
  isAbortError,
} from './api'

describe('local snapshot data access', () => {
  afterEach(() => {
    clearRankingsCache()
  })

  it('returns ATP rankings from the hardcoded snapshot', async () => {
    const response = await fetchAtpRankings()
    expect(response.standings.length).toBeGreaterThan(0)
    expect(response.standings[0]?.full_name).toBe('Jannik Sinner')
  })

  it('returns WTA rankings from the hardcoded snapshot', async () => {
    const response = await fetchWtaRankings()
    expect(response.standings[0]?.full_name).toBe('Aryna Sabalenka')
  })

  it('caches ATP and WTA rankings separately after the first load', async () => {
    const atpFirst = await fetchAtpRankings()
    const wtaFirst = await fetchWtaRankings()
    const atpSecond = await fetchAtpRankings()
    const wtaSecond = await fetchWtaRankings()

    expect(atpSecond).toBe(atpFirst)
    expect(wtaSecond).toBe(wtaFirst)
    expect(atpFirst).not.toBe(wtaFirst)
  })


  it('returns final match details from the hardcoded snapshot', async () => {
    const response = await fetchFinalMatch()
    expect(response.match.winner.full_name).toBe('Jannik Sinner')
    expect(response.match.runner_up.full_name).toBe('Alexander Zverev')
  })

  it('returns a full season profile when one exists', async () => {
    const response = await fetchPlayerSeason(1)
    expect(response.player.full_name).toBe('Jannik Sinner')
    expect(response.trajectory.length).toBeGreaterThan(0)
  })

  it('falls back to a minimal ATP profile when season data is missing', async () => {
    const response = await fetchPlayerSeason(5)
    expect(response.player.full_name).toBe('Alex de Minaur')
    expect(response.trajectory).toEqual([])
    expect(response.summary.titles).toBe(0)
  })

  it('throws when the player is unknown', async () => {
    await expect(fetchPlayerSeason(99999)).rejects.toThrow('Player not found')
  })

  it('honors AbortSignal for player season requests', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(fetchPlayerSeason(1, { signal: controller.signal })).rejects.toSatisfy(
      isAbortError,
    )
  })
})
