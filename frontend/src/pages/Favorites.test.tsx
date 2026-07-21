import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import { writeFavoriteIds } from '../favorites'
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

describe('Favorites page', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(api.fetchAtpRankings).mockResolvedValue(mockAtpRankings)
    vi.mocked(api.fetchWtaRankings).mockResolvedValue(mockWtaRankings)
  })

  it('shows an empty state when there are no favorites', async () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Favorites' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('No favorite players yet')
  })

  it('lists favorited players with profile links and allows unfavoriting', async () => {
    const user = userEvent.setup()
    writeFavoriteIds([1, 101])

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('link', { name: /Jannik Sinner/i })).toHaveAttribute(
      'href',
      '/players/1',
    )
    expect(screen.getByRole('link', { name: /Aryna Sabalenka/i })).toHaveAttribute(
      'href',
      '/players/101',
    )

    await user.click(screen.getByRole('button', { name: 'Remove Jannik Sinner from favorites' }))

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: /Jannik Sinner/i })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: /Aryna Sabalenka/i })).toBeInTheDocument()
  })
})
