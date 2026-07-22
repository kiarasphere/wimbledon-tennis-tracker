import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import { PlayerSearch } from './PlayerSearch'

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    searchPlayers: vi.fn(),
  }
})

function renderSearch() {
  return render(
    <MemoryRouter initialEntries={['/atp']}>
      <Routes>
        <Route path="/atp" element={<PlayerSearch />} />
        <Route path="/players/:playerId" element={<div>Player profile</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PlayerSearch', () => {
  it('debounces input and shows matching players', async () => {
    const user = userEvent.setup()
    vi.mocked(api.searchPlayers).mockReturnValue([
      {
        player_id: 1,
        full_name: 'Jannik Sinner',
        name_acronym: 'SIN',
        country: 'ITA',
        country_colour: '009246',
        photo_url: null,
        tour: 'ATP',
        position: 1,
      },
    ])

    renderSearch()

    await user.type(screen.getByRole('combobox', { name: 'Search players' }), 'sin')

    expect(api.searchPlayers).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(api.searchPlayers).toHaveBeenCalledWith('sin')
    })

    expect(await screen.findByRole('option', { name: /Jannik Sinner/i })).toBeInTheDocument()
    expect(screen.getByText('ATP')).toBeInTheDocument()
  })

  it('navigates to the player profile when a result is selected', async () => {
    const user = userEvent.setup()
    vi.mocked(api.searchPlayers).mockReturnValue([
      {
        player_id: 1,
        full_name: 'Jannik Sinner',
        name_acronym: 'SIN',
        country: 'ITA',
        country_colour: '009246',
        photo_url: null,
        tour: 'ATP',
        position: 1,
      },
    ])

    renderSearch()

    await user.type(screen.getByRole('combobox', { name: 'Search players' }), 'sinner')

    const option = await screen.findByRole('option', { name: /Jannik Sinner/i })
    await user.click(option.querySelector('a')!)

    expect(await screen.findByText('Player profile')).toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    vi.mocked(api.searchPlayers).mockReturnValue([])

    renderSearch()

    await user.type(screen.getByRole('combobox', { name: 'Search players' }), 'xyz')

    expect(await screen.findByText('No players match “xyz”')).toBeInTheDocument()
  })
})
