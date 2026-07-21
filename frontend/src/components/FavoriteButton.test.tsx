import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { FavoritesProvider } from '../favoritesContext'
import { FavoriteButton } from './FavoriteButton'

function renderButton() {
  return render(
    <FavoritesProvider>
      <FavoriteButton playerId={1} playerName="Jannik Sinner" />
    </FavoritesProvider>,
  )
}

describe('FavoriteButton', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('toggles favorite state and persists to localStorage', async () => {
    const user = userEvent.setup()
    renderButton()

    const button = screen.getByRole('button', { name: 'Add Jannik Sinner to favorites' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveTextContent('☆')

    await user.click(button)

    expect(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' })).toHaveTextContent(
      '★',
    )
    expect(window.localStorage.getItem('tennis-tracker:favorite-player-ids')).toBe('[1]')

    await user.click(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' }))
    expect(screen.getByRole('button', { name: 'Add Jannik Sinner to favorites' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(window.localStorage.getItem('tennis-tracker:favorite-player-ids')).toBe('[]')
  })
})
