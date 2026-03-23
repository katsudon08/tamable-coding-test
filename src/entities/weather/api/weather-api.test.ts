import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDailyWeather, fetchHourlyWeather } from './weather-api'
import { CITIES } from '../constants/cities'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('weather-api', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('fetchHourlyWeather', () => {
    it('正しいURLとパラメータでfetchが呼ばれること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          latitude: CITIES.tokyo.lat,
          longitude: CITIES.tokyo.lon,
          timezone: 'Asia/Tokyo',
          hourly: {
            time: ['2026-01-01T00:00'],
            temperature_2m: [10],
          },
        }),
      })

      const res = await fetchHourlyWeather({
        city: 'tokyo',
        metrics: ['temperature_2m', 'apparent_temperature'],
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const requestedUrlString = mockFetch.mock.calls[0][0]
      const requestedUrl = new URL(requestedUrlString)

      expect(requestedUrl.origin + requestedUrl.pathname).toBe(
        'https://api.open-meteo.com/v1/forecast',
      )
      expect(requestedUrl.searchParams.get('latitude')).toBe(
        CITIES.tokyo.lat.toString(),
      )
      expect(requestedUrl.searchParams.get('longitude')).toBe(
        CITIES.tokyo.lon.toString(),
      )
      expect(requestedUrl.searchParams.getAll('hourly')).toEqual([
        'temperature_2m',
        'apparent_temperature',
      ])
      expect(requestedUrl.searchParams.get('forecast_days')).toBe('2')
      expect(requestedUrl.searchParams.get('temperature_unit')).toBe('celsius')

      expect(res.timezone).toBe('Asia/Tokyo')
      expect(res.hourly.temperature_2m).toEqual([10])
    })

    it('エラーを含むレスポンスの場合は例外をスローすること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(
        fetchHourlyWeather({ city: 'tokyo', metrics: ['temperature_2m'] }),
      ).rejects.toThrow('Failed to fetch hourly weather data')
    })
  })

  describe('fetchDailyWeather', () => {
    it('正しいURLとパラメータでfetchが呼ばれること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          latitude: CITIES.osaka.lat,
          longitude: CITIES.osaka.lon,
          timezone: 'Asia/Tokyo',
          daily: {
            time: ['2026-01-01'],
            temperature_2m_max: [15],
            temperature_2m_min: [5],
          },
        }),
      })

      const res = await fetchDailyWeather({
        city: 'osaka',
        metrics: ['temperature_2m_max', 'temperature_2m_min'],
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const requestedUrlString = mockFetch.mock.calls[0][0]
      const requestedUrl = new URL(requestedUrlString)

      expect(requestedUrl.origin + requestedUrl.pathname).toBe(
        'https://api.open-meteo.com/v1/forecast',
      )
      expect(requestedUrl.searchParams.get('latitude')).toBe(
        CITIES.osaka.lat.toString(),
      )
      expect(requestedUrl.searchParams.get('longitude')).toBe(
        CITIES.osaka.lon.toString(),
      )
      expect(requestedUrl.searchParams.getAll('daily')).toEqual([
        'temperature_2m_max',
        'temperature_2m_min',
      ])
      expect(requestedUrl.searchParams.get('forecast_days')).toBe('7')

      expect(res.timezone).toBe('Asia/Tokyo')
      expect(res.daily.temperature_2m_max).toEqual([15])
    })

    it('エラーを含むレスポンスの場合は例外をスローすること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(
        fetchDailyWeather({ city: 'osaka', metrics: ['temperature_2m_max'] }),
      ).rejects.toThrow('Failed to fetch daily weather data')
    })
  })
})
