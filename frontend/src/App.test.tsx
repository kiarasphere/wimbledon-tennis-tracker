import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
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

function SearchParamsProbe({ onChange }: { onChange: (search: string) => void }) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    onChange(searchParams.toString())
  }, [onChange, searchParams])

  return null
}

function renderApp(initialPath = '/atp', onSearchChange?: (search: string) => void) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      {onSearchChange ? <SearchParamsProbe onChange={onSearchChange} /> : null}
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('filters ATP standings client-side and syncs the query to the URL', async () => {
    const user = userEvent.setup()
    let search = ''
    renderApp('/atp', (next) => {
      search = next
    })

    await screen.findByText('Jannik Sinner')
    expect(screen.getByText('Alexander Zverev')).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)

    const input = screen.getByLabelText('Search players')
    await user.type(input, 'sinner')

    expect(screen.getByText('Jannik Sinner')).toBeInTheDocument()
    expect(screen.queryByText('Alexander Zverev')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2')).toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
    expect(search).toBe('q=sinner')

    await user.clear(input)
    expect(screen.getByText('Alexander Zverev')).toBeInTheDocument()
    expect(search).toBe('')
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
  })

  it('restores an ATP search from the URL and shows an empty state when nothing matches', async () => {
    renderApp('/atp?q=nadal')

    expect(await screen.findByText('No players match “nadal”.')).toBeInTheDocument()
    expect(screen.getByLabelText('Search players')).toHaveValue('nadal')
    expect(screen.queryByText('Jannik Sinner')).not.toBeInTheDocument()
    expect(api.fetchAtpRankings).toHaveBeenCalledTimes(1)
  })

  it('shows a search bar on WTA rankings', async () => {
    renderApp('/wta')

    expect(await screen.findByLabelText('Search players')).toBeInTheDocument()
    expect(screen.getByText('Aryna Sabalenka')).toBeInTheDocument()
  })
})
