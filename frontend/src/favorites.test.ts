import { beforeEach, describe, expect, it } from 'vitest'
import { FAVORITES_STORAGE_KEY, loadFavoriteIds, saveFavoriteIds } from './favorites'

describe('favorites storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(loadFavoriteIds()).toEqual([])
  })

  it('persists and restores favorite player IDs', () => {
    saveFavoriteIds([1, 101])
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[1,101]')
    expect(loadFavoriteIds()).toEqual([1, 101])
  })

  it('ignores malformed localStorage values', () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, '{not-json')
    expect(loadFavoriteIds()).toEqual([])

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['a', 2, null]))
    expect(loadFavoriteIds()).toEqual([2])
  })
})
