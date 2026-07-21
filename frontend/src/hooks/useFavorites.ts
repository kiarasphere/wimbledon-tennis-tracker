import { useSyncExternalStore } from 'react'
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  isFavoriteId,
  toggleFavoriteId,
} from '../favorites'

function subscribe(onStoreChange: () => void): () => void {
  const onChange = () => onStoreChange()
  window.addEventListener(FAVORITES_CHANGED_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function getSnapshot(): string {
  return window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]'
}

function getServerSnapshot(): string {
  return '[]'
}

function parseFavoriteIds(snapshot: string): number[] {
  try {
    const parsed: unknown = JSON.parse(snapshot)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
  } catch {
    return []
  }
}

export function useFavorites() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const favoriteIds = parseFavoriteIds(snapshot)

  return {
    favoriteIds,
    isFavorite: (playerId: number) => isFavoriteId(playerId, favoriteIds),
    toggleFavorite: (playerId: number) => toggleFavoriteId(playerId),
  }
}
