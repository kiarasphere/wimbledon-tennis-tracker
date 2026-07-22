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

vi.mock('./api', async () => {
  const actual = await vi.importActual<typeof import('./api')>('./api')
  return {
    ...actual,
    fetchAtpRankings: vi.fn(),
    fetchWtaRankings: vi.fn(),
    fetchCountryRankings: vi.fn(),
    fetchLatestResults: vi.fn(),
    fetchFinalMatch: vi.fn(),
    fetchPlayerSeason: vi.fn(),
  }
})

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

  it('renders a player search bar in the top nav', async () => {
    renderApp('/atp')

    await screen.findByRole('heading', { name: 'ATP Rankings' })
    expect(screen.getByRole('combobox', { name: 'Search players' })).toBeInTheDocument()
  })
})
