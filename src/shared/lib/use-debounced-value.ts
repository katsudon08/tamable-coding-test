import { useState, useEffect } from 'react'

/**
 * useDebouncedValue
 * 値が変化してから一定時間経過した後に更新されるデバウンスされた値を返すフック
 * 
 * @param value デバウンス対象の値
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
