import { beforeEach, describe, expect, it } from 'vitest'
import {
  FAVORITES_STORAGE_KEY,
  isFavoriteId,
  readFavoriteIds,
  toggleFavoriteId,
  writeFavoriteIds,
} from './favorites'

describe('favorites storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(readFavoriteIds()).toEqual([])
  })

  it('persists and restores favorite player IDs', () => {
    writeFavoriteIds([1, 101])
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[1,101]')
    expect(readFavoriteIds()).toEqual([1, 101])
    expect(isFavoriteId(1)).toBe(true)
    expect(isFavoriteId(2)).toBe(false)
  })

  it('toggles favorites on and off', () => {
    expect(toggleFavoriteId(1)).toBe(true)
    expect(readFavoriteIds()).toEqual([1])
    expect(toggleFavoriteId(1)).toBe(false)
    expect(readFavoriteIds()).toEqual([])
  })

  it('ignores corrupt localStorage values', () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, '{not-json')
    expect(readFavoriteIds()).toEqual([])
  })
})
