import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAtpRankings, fetchPlayerSeason } from './api'

describe('fetchJson error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('parses FastAPI JSON detail instead of raw body text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => JSON.stringify({ detail: 'Player not found' }),
      }),
    )

    await expect(fetchAtpRankings()).rejects.toThrow('Player not found')
  })

  it('falls back to raw text for non-JSON error bodies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      }),
    )

    await expect(fetchAtpRankings()).rejects.toThrow('Internal Server Error')
  })

  it('uses a status fallback when the error body is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: async () => '',
      }),
    )

    await expect(fetchAtpRankings()).rejects.toThrow('Request failed with status 503')
  })

  it('times out hung requests instead of spinning forever', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      }),
    )

    const assertion = expect(fetchAtpRankings()).rejects.toThrow(
      'Request timed out — try again in a moment',
    )
    await vi.advanceTimersByTimeAsync(10_000)
    await assertion
  })

  it('forwards AbortSignal abort to fetch for player season requests', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const controller = new AbortController()
    const pending = fetchPlayerSeason(1, { signal: controller.signal })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/players/1/season',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )

    controller.abort()
    await expect(pending).rejects.toSatisfy(isAbortErrorLike)
  })
})

function isAbortErrorLike(err: unknown): boolean {
  return err instanceof DOMException
    ? err.name === 'AbortError'
    : err instanceof Error && err.name === 'AbortError'
}
