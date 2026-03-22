import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useWeatherQuery } from './use-weather-query'
import * as weatherApi from '../api/weather-api'
import type { HourlyResponse, DailyResponse, City } from './types'

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

    it('引数が短時間に頻繁に変更された場合、API呼び出しがデバウンスされること', async () => {
        mockFetchHourly.mockResolvedValue(hourlyResponse)

        const { rerender } = renderHook(
            ({ city }: { city: City }) =>
                useWeatherQuery(city, '48h', ['temperature_2m'], {
                    temp: 'C',
                    wind: 'ms',
                }),
            {
                wrapper: createWrapper(),
                initialProps: { city: 'tokyo' as City },
            },
        )

        // 初回（tokyo）のリクエストが開始されるのを待つ (初回は即時)
        await waitFor(() => expect(mockFetchHourly).toHaveBeenCalledWith(
            expect.objectContaining({ city: 'tokyo' })
        ))
        mockFetchHourly.mockClear()

        // 短時間に連続して引数を変更する
        rerender({ city: 'osaka' as City })
        rerender({ city: 'fukuoka' as City })
        rerender({ city: 'sapporo' as City })

        // 200ms時点ではまだ呼ばれていないはず（デバウンス中: 300ms設定）
        await new Promise(resolve => setTimeout(resolve, 200))
        expect(mockFetchHourly).not.toHaveBeenCalled()

        // 最後に変更してから300ms以上経過するのを待つ
        await waitFor(() => expect(mockFetchHourly).toHaveBeenCalledWith(
            expect.objectContaining({ city: 'sapporo' })
        ), { timeout: 2000 })

        // 中間状態のリクエストは発生せず、最終的な状態のみリクエストされる
        expect(mockFetchHourly).toHaveBeenCalledTimes(1)
        expect(mockFetchHourly).not.toHaveBeenCalledWith(
            expect.objectContaining({ city: 'osaka' })
        )
        expect(mockFetchHourly).not.toHaveBeenCalledWith(
            expect.objectContaining({ city: 'fukuoka' })
        )
    })
})
