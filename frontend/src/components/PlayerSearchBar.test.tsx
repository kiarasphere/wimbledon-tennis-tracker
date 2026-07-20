import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PlayerSearchBar } from './PlayerSearchBar'

describe('PlayerSearchBar', () => {
  it('renders a labeled search input', () => {
    render(
      <PlayerSearchBar value="" onChange={() => undefined} resultCount={10} totalCount={10} />,
    )

    expect(screen.getByLabelText('Search players')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by player name…')).toBeInTheDocument()
  })

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <PlayerSearchBar value="" onChange={onChange} resultCount={10} totalCount={10} />,
    )

    await user.type(screen.getByLabelText('Search players'), 'sin')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows result counts when a query is present', () => {
    render(
      <PlayerSearchBar value="sin" onChange={() => undefined} resultCount={1} totalCount={20} />,
    )

    expect(screen.getByText('1 of 20')).toBeInTheDocument()
  })

  it('hides result counts when the query is empty', () => {
    render(
      <PlayerSearchBar value="" onChange={() => undefined} resultCount={20} totalCount={20} />,
    )

    expect(screen.queryByText(/of/)).not.toBeInTheDocument()
  })
})
