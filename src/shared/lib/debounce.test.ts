import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('指定時間内に複数回呼ばれた場合、最後に呼ばれた1回のみ実行されること', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(50)
    expect(mockFn).not.toBeCalled()

    // さらに時間が経過すると実行される
    vi.advanceTimersByTime(50)
    expect(mockFn).toBeCalledTimes(1)
  })
})
