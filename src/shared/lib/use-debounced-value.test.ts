import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useDebouncedValue } from './use-debounced-value'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期値が即座に返されること', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('値が変更されても、指定時間が経過するまで更新されないこと', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    // 値を更新
    rerender({ value: 'updated', delay: 500 })

    // まだ更新されていない
    expect(result.current).toBe('initial')

    // 250ms経過（まだ更新されない）
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial')

    // さらに250ms経過（合計500ms経過で更新される）
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('updated')
  })

  it('指定時間内に複数回値が変更された場合、最後に変更された値が採用されること', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    // 1回目の更新
    rerender({ value: 'update-1', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // 2回目の更新（タイマーがリセットされる）
    rerender({ value: 'update-2', delay: 500 })
    
    // さらに300ms経過（合計600msだが、最後の更新からは300msなのでまだ更新されない）
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // さらに200ms経過（最後の更新から500ms経過）
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('update-2')
  })
})
