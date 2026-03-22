import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useWeatherQuery } from './use-weather-query'
import * as weatherApi from '../api/weather-api'
import type { HourlyResponse, DailyResponse } from './types'

vi.mock('../api/weather-api')

const mockFetchHourly = vi.mocked(weatherApi.fetchHourlyWeather)
const mockFetchDaily = vi.mocked(weatherApi.fetchDailyWeather)

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })
    return ({ children }: { children: ReactNode }) =>
        createElement(
            QueryClientProvider,
            { client: queryClient },
            children,
        )
}

const hourlyResponse: HourlyResponse = {
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    hourly: {
        time: ['2026-01-01T00:00', '2026-01-01T01:00'],
        temperature_2m: [10, 12],
        apparent_temperature: [8, 10],
        precipitation: [0, 0.5],
        windspeed_10m: [3, 5],
    },
}

const dailyResponse: DailyResponse = {
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    daily: {
        time: ['2026-01-01', '2026-01-02'],
        temperature_2m_max: [15, 18],
        temperature_2m_min: [5, 8],
    },
}

describe('useWeatherQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('48h期間の場合、fetchHourlyWeatherが呼ばれること', async () => {
        mockFetchHourly.mockResolvedValueOnce(hourlyResponse)

        const { result } = renderHook(
            () =>
                useWeatherQuery('tokyo', '48h', ['temperature_2m'], {
                    temp: 'C',
                    wind: 'ms',
                }),
            { wrapper: createWrapper() },
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(mockFetchHourly).toHaveBeenCalledWith({
            city: 'tokyo',
            metrics: ['temperature_2m'],
        })
        expect(mockFetchDaily).not.toHaveBeenCalled()
        expect(result.current.data).toHaveLength(2)
    })

    it('7d期間の場合、fetchDailyWeatherが呼ばれること', async () => {
        mockFetchDaily.mockResolvedValueOnce(dailyResponse)

        const { result } = renderHook(
            () =>
                useWeatherQuery(
                    'osaka',
                    '7d',
                    ['temperature_2m_max'],
                    { temp: 'C', wind: 'ms' },
                ),
            { wrapper: createWrapper() },
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(mockFetchDaily).toHaveBeenCalledWith({
            city: 'osaka',
            metrics: ['temperature_2m_max'],
        })
        expect(mockFetchHourly).not.toHaveBeenCalled()
        expect(result.current.data).toHaveLength(2)
    })

    it('metricsが空の場合、クエリが無効化されること', () => {
        const { result } = renderHook(
            () =>
                useWeatherQuery('tokyo', '48h', [], {
                    temp: 'C',
                    wind: 'ms',
                }),
            { wrapper: createWrapper() },
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(mockFetchHourly).not.toHaveBeenCalled()
        expect(mockFetchDaily).not.toHaveBeenCalled()
    })

    it('APIエラー時にisErrorがtrueになること', async () => {
        mockFetchHourly.mockRejectedValueOnce(new Error('Network error'))

        const { result } = renderHook(
            () =>
                useWeatherQuery('tokyo', '48h', ['temperature_2m'], {
                    temp: 'C',
                    wind: 'ms',
                }),
            { wrapper: createWrapper() },
        )

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})
