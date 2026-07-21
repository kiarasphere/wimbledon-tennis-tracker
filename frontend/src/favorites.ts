/** localStorage key for favorited player IDs (client-only; no auth). */
export const FAVORITES_STORAGE_KEY = 'tennis-tracker:favorite-player-ids'

export function loadFavoriteIds(): number[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
  } catch {
    return []
  }
}

export function saveFavoriteIds(ids: number[]): void {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
}
