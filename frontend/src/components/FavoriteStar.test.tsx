import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { FAVORITES_STORAGE_KEY, readFavoriteIds } from '../favorites'
import { FavoriteStar } from './FavoriteStar'

describe('FavoriteStar', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('toggles favorite state and persists to localStorage', async () => {
    const user = userEvent.setup()
    render(<FavoriteStar playerId={1} playerName="Jannik Sinner" />)

    const button = screen.getByRole('button', { name: 'Add Jannik Sinner to favorites' })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(readFavoriteIds()).toEqual([1])
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[1]')

    await user.click(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' }))
    expect(readFavoriteIds()).toEqual([])
  })
})
