import { describe, it, expect } from 'vitest'
import { formatHourlyData, formatDailyData } from './weather-formatter'
import { HourlyResponse, DailyResponse, UnitState } from '../model/types'

describe('weather-formatter', () => {
  const mockHourlyData: HourlyResponse = {
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
    hourly: {
      time: ['2024-01-01T00:00', '2024-01-01T01:00'],
      temperature_2m: [10, 12],
      apparent_temperature: [8, 10],
      precipitation: [0, 1.5],
      windspeed_10m: [2, 3]
    }
  }

  const mockDailyData: DailyResponse = {
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
    daily: {
      time: ['2024-01-01', '2024-01-02'],
      temperature_2m_max: [15, 12],
      temperature_2m_min: [5, 2]
    }
  }

  describe('formatHourlyData', () => {
    it('単位変換なし(C, ms)で正しく整形されること', () => {
      const unitState: UnitState = { temp: 'C', wind: 'ms' }
      const result = formatHourlyData(mockHourlyData, unitState)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        time: '2024-01-01T00:00',
        temperature_2m: 10,
        apparent_temperature: 8,
        precipitation: 0,
        windspeed_10m: 2
      })
      expect(result[1]).toEqual({
        time: '2024-01-01T01:00',
        temperature_2m: 12,
        apparent_temperature: 10,
        precipitation: 1.5,
        windspeed_10m: 3
      })
    })

    it('単位変換あり(F, kmh)で正しく整形されること', () => {
      const unitState: UnitState = { temp: 'F', wind: 'kmh' }
      const result = formatHourlyData(mockHourlyData, unitState)

      expect(result[0]).toEqual({
        time: '2024-01-01T00:00',
        temperature_2m: 50, // 10 * 1.8 + 32
        apparent_temperature: 46.4, // 8 * 1.8 + 32
        precipitation: 0,
        windspeed_10m: 7.2 // 2 * 3.6
      })
    })
  })

  describe('formatDailyData', () => {
    it('単位変換なし(C)で正しく整形されること', () => {
      const unitState: UnitState = { temp: 'C', wind: 'ms' }
      const result = formatDailyData(mockDailyData, unitState)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        time: '2024-01-01',
        temperature_2m_max: 15,
        temperature_2m_min: 5
      })
    })

    it('単位変換あり(F)で正しく整形されること', () => {
      const unitState: UnitState = { temp: 'F', wind: 'ms' }
      const result = formatDailyData(mockDailyData, unitState)

      expect(result[0]).toEqual({
        time: '2024-01-01',
        temperature_2m_max: 59, // 15 * 1.8 + 32
        temperature_2m_min: 41  // 5 * 1.8 + 32
      })
    })
  })
})
