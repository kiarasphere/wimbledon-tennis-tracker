import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import { mockAtpRankings, mockWtaRankings } from '../test/fixtures'
import { NavPlayerSearch } from './NavPlayerSearch'

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    fetchAtpRankings: vi.fn(),
    fetchWtaRankings: vi.fn(),
  }
})

function renderSearch(initialPath = '/countries') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavPlayerSearch />
      <Routes>
        <Route path="/players/:playerId" element={<div>Player profile</div>} />
        <Route path="*" element={<div>Other page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NavPlayerSearch', () => {
  beforeEach(() => {
    vi.mocked(api.fetchAtpRankings).mockResolvedValue(mockAtpRankings)
    vi.mocked(api.fetchWtaRankings).mockResolvedValue(mockWtaRankings)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders a labeled search input', () => {
    renderSearch()

    expect(screen.getByLabelText('Search players')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search players…')).toBeInTheDocument()
  })

  it('loads rankings once on focus and filters after debounce', async () => {
    const user = userEvent.setup()
    renderSearch()

    const input = screen.getByLabelText('Search players')
    await user.click(input)
    await user.type(input, 'sin')

    expect(await screen.findByRole('option', { name: /Jannik Sinner/i })).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(1)

    await user.type(input, 'ner')
    expect(await screen.findByRole('option', { name: /Jannik Sinner/i })).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(1)
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.click(screen.getByLabelText('Search players'))
    await user.type(screen.getByLabelText('Search players'), 'nadal')

    expect(await screen.findByText('No players match.')).toBeInTheDocument()
  })

  it('navigates to the player profile and closes results on select', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.click(screen.getByLabelText('Search players'))
    await user.type(screen.getByLabelText('Search players'), 'saba')

    const option = await screen.findByRole('option', { name: /Aryna Sabalenka/i })
    await user.click(option)

    expect(await screen.findByText('Player profile')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Search players')).toHaveValue('')
  })

  it('clears the query and dismisses results', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.click(screen.getByLabelText('Search players'))
    await user.type(screen.getByLabelText('Search players'), 'zve')

    expect(await screen.findByRole('option', { name: /Alexander Zverev/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(screen.getByLabelText('Search players')).toHaveValue('')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('matches player acronyms', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.click(screen.getByLabelText('Search players'))
    await user.type(screen.getByLabelText('Search players'), 'sin')

    const listbox = await screen.findByRole('listbox')
    expect(within(listbox).getByRole('option', { name: /Jannik Sinner/i })).toBeInTheDocument()
  })
})
