import { describe, it, expect } from 'vitest'
import { convertTemp, convertWindSpeed } from './unit-converter'

describe('unit-converter', () => {
  describe('convertTemp', () => {
    it('toFahrenheit = falseの場合、入力値をそのまま返すこと', () => {
      expect(convertTemp(20, false)).toBe(20)
      expect(convertTemp(0, false)).toBe(0)
      expect(convertTemp(-10, false)).toBe(-10)
    })

    it('toFahrenheit = trueの場合、摂氏から華氏へ正しく変換されること', () => {
      expect(convertTemp(20, true)).toBe(68)
      expect(convertTemp(0, true)).toBe(32)
      expect(convertTemp(-10, true)).toBe(14)
      expect(convertTemp(22.5, true)).toBe(72.5) // 22.5 * 1.8 + 32 = 40.5 + 32 = 72.5
    })
  })

  describe('convertWindSpeed', () => {
    it('toKmh = falseの場合、入力値をそのまま返すこと', () => {
      expect(convertWindSpeed(5, false)).toBe(5)
      expect(convertWindSpeed(0, false)).toBe(0)
    })

    it('toKmh = trueの場合、秒速から時速へ正しく変換されること', () => {
      expect(convertWindSpeed(5, true)).toBe(18) // 5 * 3.6 = 18
      expect(convertWindSpeed(10, true)).toBe(36) // 10 * 3.6 = 36
      expect(convertWindSpeed(2.5, true)).toBe(9) // 2.5 * 3.6 = 9
    })
  })
})
