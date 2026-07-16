import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PlayerSearchBar } from './PlayerSearchBar'

describe('PlayerSearchBar', () => {
  it('renders a labeled search input', () => {
    render(<PlayerSearchBar value="" onChange={() => {}} />)

    expect(screen.getByLabelText('Search players')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by player name…')).toBeInTheDocument()
  })

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PlayerSearchBar value="" onChange={onChange} />)

    await user.type(screen.getByLabelText('Search players'), 'Sin')

    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.some((call) => call[0].includes('S'))).toBe(true)
  })

  it('shows a clear control and result count when there is a query', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <PlayerSearchBar value="sin" onChange={onChange} resultCount={1} totalCount={10} />,
    )

    expect(screen.getByText('Showing 1 of 10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
