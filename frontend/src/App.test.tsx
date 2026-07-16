import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import * as api from './api'
import {
  mockAtpRankings,
  mockCountryRankings,
  mockFinalMatch,
  mockLatestResults,
  mockWtaRankings,
} from './test/fixtures'

vi.mock('./api', () => ({
  fetchAtpRankings: vi.fn(),
  fetchWtaRankings: vi.fn(),
  fetchCountryRankings: vi.fn(),
  fetchLatestResults: vi.fn(),
  fetchFinalMatch: vi.fn(),
  fetchPlayerSeason: vi.fn(),
}))

function renderApp(initialPath = '/atp') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(api.fetchAtpRankings).mockResolvedValue(mockAtpRankings)
    vi.mocked(api.fetchWtaRankings).mockResolvedValue(mockWtaRankings)
    vi.mocked(api.fetchCountryRankings).mockResolvedValue(mockCountryRankings)
    vi.mocked(api.fetchLatestResults).mockResolvedValue(mockLatestResults)
    vi.mocked(api.fetchFinalMatch).mockResolvedValue(mockFinalMatch)
  })

  it('redirects / to ATP rankings', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { name: 'ATP Rankings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ATP' })).toHaveClass('active')
  })

  it('navigates between primary routes', async () => {
    const user = userEvent.setup()
    renderApp('/atp')

    await screen.findByRole('heading', { name: 'ATP Rankings' })

    await user.click(screen.getByRole('link', { name: 'WTA' }))
    expect(await screen.findByRole('heading', { name: 'WTA Rankings' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Countries' }))
    expect(await screen.findByRole('heading', { name: 'Country Rankings' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Results' }))
    expect(await screen.findByRole('heading', { name: 'Wimbledon Results' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Final' }))
    expect(await screen.findByRole('heading', { name: 'Wimbledon 2026 Final' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Final' })).toHaveClass('active')

    await user.click(screen.getByRole('link', { name: 'ATP' }))
    expect(await screen.findByRole('heading', { name: 'ATP Rankings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ATP' })).toHaveClass('active')
  })

  it('filters ATP rankings by player name without extra API calls', async () => {
    const user = userEvent.setup()
    renderApp('/atp')

    expect(await screen.findByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.getByText('Alexander Zverev')).toBeInTheDocument()
    const callsAfterLoad = vi.mocked(api.fetchAtpRankings).mock.calls.length

    const search = screen.getByRole('searchbox', { name: 'Search players' })
    await user.type(search, 'sinner')

    expect(screen.getByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.queryByText('Alexander Zverev')).not.toBeInTheDocument()
    expect(search).toHaveValue('sinner')
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(callsAfterLoad)

    await user.clear(search)
    expect(screen.getByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.getByText('Alexander Zverev')).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(callsAfterLoad)
  })

  it('restores ATP search from the URL query param', async () => {
    renderApp('/atp?q=zverev')

    expect(await screen.findByRole('searchbox', { name: 'Search players' })).toHaveValue('zverev')
    expect(screen.getByText('Alexander Zverev')).toBeInTheDocument()
    expect(screen.queryByText('Jannik Sinner')).not.toBeInTheDocument()
  })

  it('shows an empty state when no ATP players match', async () => {
    const user = userEvent.setup()
    renderApp('/atp')

    await screen.findByText('Jannik Sinner')
    await user.type(screen.getByRole('searchbox', { name: 'Search players' }), 'nadal')

    expect(screen.getByRole('status')).toHaveTextContent('No players match “nadal”.')
    expect(screen.queryByText('Jannik Sinner')).not.toBeInTheDocument()
  })

  it('filters WTA rankings by player name', async () => {
    const user = userEvent.setup()
    renderApp('/wta')

    expect(await screen.findByText('Aryna Sabalenka')).toBeInTheDocument()
    const callsAfterLoad = vi.mocked(api.fetchWtaRankings).mock.calls.length

    await user.type(screen.getByRole('searchbox', { name: 'Search players' }), 'sab')
    expect(screen.getByText('Aryna Sabalenka')).toBeInTheDocument()
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(callsAfterLoad)

    await user.clear(screen.getByRole('searchbox', { name: 'Search players' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search players' }), 'xyz')
    expect(screen.getByRole('status')).toHaveTextContent('No players match “xyz”.')
    expect(api.fetchWtaRankings).toHaveBeenCalledTimes(callsAfterLoad)
  })
})
