import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FAVORITES_STORAGE_KEY, loadFavoriteIds, saveFavoriteIds } from './favorites'

interface FavoritesContextValue {
  favoriteIds: number[]
  isFavorite: (playerId: number) => boolean
  toggleFavorite: (playerId: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => loadFavoriteIds())

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
        setFavoriteIds(loadFavoriteIds())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback(
    (playerId: number) => favoriteIds.includes(playerId),
    [favoriteIds],
  )

  const toggleFavorite = useCallback((playerId: number) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
      saveFavoriteIds(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return ctx
}
