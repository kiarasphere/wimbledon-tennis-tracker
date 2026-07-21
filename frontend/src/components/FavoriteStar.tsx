import { useFavorites } from '../hooks/useFavorites'

interface FavoriteStarProps {
  playerId: number
  playerName: string
  className?: string
}

export function FavoriteStar({ playerId, playerName, className }: FavoriteStarProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(playerId)

  return (
    <button
      type="button"
      className={['favorite-star', favorited ? 'is-favorited' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={favorited ? `Remove ${playerName} from favorites` : `Add ${playerName} to favorites`}
      aria-pressed={favorited}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(playerId)
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        {favorited ? (
          <path
            fill="currentColor"
            d="M12 2.5l2.85 5.77 6.37.93-4.61 4.49 1.09 6.35L12 16.98l-5.7 3.06 1.09-6.35-4.61-4.49 6.37-.93L12 2.5z"
          />
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            d="M12 3.2l2.55 5.17 5.71.83-4.13 4.03.98 5.69L12 16.2l-5.11 2.72.98-5.69-4.13-4.03 5.71-.83L12 3.2z"
          />
        )}
      </svg>
    </button>
  )
}
