import { useFavorites } from '../favoritesContext'

interface FavoriteButtonProps {
  playerId: number
  playerName?: string | null
  className?: string
}

export function FavoriteButton({ playerId, playerName, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(playerId)
  const labelName = playerName?.trim() || `Player ${playerId}`

  return (
    <button
      type="button"
      className={['favorite-button', favorited ? 'is-favorite' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={favorited}
      aria-label={favorited ? `Remove ${labelName} from favorites` : `Add ${labelName} to favorites`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(playerId)
      }}
    >
      <span className="favorite-star" aria-hidden="true">
        {favorited ? '★' : '☆'}
      </span>
    </button>
  )
}
