/** Client-side favorite player IDs (no auth / no backend store). */

export const FAVORITES_STORAGE_KEY = 'tennis-tracker-favorites'
export const FAVORITES_CHANGED_EVENT = 'tennis-tracker-favorites-changed'

function notifyFavoritesChanged(): void {
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT))
}

export function readFavoriteIds(): number[] {
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

export function writeFavoriteIds(ids: number[]): void {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  notifyFavoritesChanged()
}

export function isFavoriteId(playerId: number, ids: number[] = readFavoriteIds()): boolean {
  return ids.includes(playerId)
}

/** Returns the new favorite state after toggling. */
export function toggleFavoriteId(playerId: number): boolean {
  const current = readFavoriteIds()
  const already = current.includes(playerId)
  const next = already ? current.filter((id) => id !== playerId) : [...current, playerId]
  writeFavoriteIds(next)
  return !already
}
