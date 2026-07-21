import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import { FavoritesProvider } from '../favoritesContext'
import { saveFavoriteIds } from '../favorites'
import { mockAtpRankings, mockWtaRankings } from '../test/fixtures'
import { Favorites } from './Favorites'

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    fetchAtpRankings: vi.fn(),
    fetchWtaRankings: vi.fn(),
  }
})

function renderFavorites() {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <Favorites />
      </FavoritesProvider>
    </MemoryRouter>,
  )
}

describe('Favorites page', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(api.fetchAtpRankings).mockResolvedValue(mockAtpRankings)
    vi.mocked(api.fetchWtaRankings).mockResolvedValue(mockWtaRankings)
  })

  it('shows an empty state when there are no favorites and skips rankings fetches', async () => {
    renderFavorites()

    expect(
      await screen.findByText(
        'No favorites yet. Star a player on the ATP or WTA rankings to see them here.',
      ),
    ).toBeInTheDocument()
    expect(api.fetchAtpRankings).not.toHaveBeenCalled()
    expect(api.fetchWtaRankings).not.toHaveBeenCalled()
  })

  it('lists favorited players with profile links and allows unfavoriting', async () => {
    const user = userEvent.setup()
    saveFavoriteIds([1, 101])
    renderFavorites()

    expect(await screen.findByRole('heading', { name: 'Favorites' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Jannik Sinner/i })).toHaveAttribute(
      'href',
      '/players/1',
    )
    expect(screen.getByRole('link', { name: /Aryna Sabalenka/i })).toHaveAttribute(
      'href',
      '/players/101',
    )
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' }))
    expect(screen.queryByRole('link', { name: /Jannik Sinner/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Aryna Sabalenka/i })).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(1)
  })
})
