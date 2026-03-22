import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    City,
    Period,
    Metric,
    HourlyMetric,
    DailyMetric,
    UnitState,
    ChartDataPoint,
    HourlyResponse,
    DailyResponse,
} from './types'
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'
import { fetchHourlyWeather, fetchDailyWeather } from '../api/weather-api'
import { formatHourlyData, formatDailyData } from '../lib/weather-formatter'

const HOURLY_METRICS: HourlyMetric[] = [
    'temperature_2m',
    'apparent_temperature',
    'precipitation',
    'windspeed_10m',
]

const DAILY_METRICS: DailyMetric[] = ['temperature_2m_max', 'temperature_2m_min']

export const useWeatherQuery = (
    city: City,
    period: Period,
    metrics: Metric[],
    unitState: UnitState,
) => {
    // APIリクエストの頻度を抑制するため、入力をデバウンスする
    // 引数オブジェクトがレンダリングのたびに再生成されないようuseMemoを使用
    const debouncedParams = useDebouncedValue(
        useMemo(() => ({ city, period, metrics, unitState }), [
            city,
            period,
            metrics,
            unitState,
        ]),
        300,
    )
    const {
        city: dCity,
        period: dPeriod,
        metrics: dMetrics,
        unitState: dUnitState,
    } = debouncedParams

    return useQuery<ChartDataPoint[]>({
        queryKey: ['weather', dCity, dPeriod, [...dMetrics].sort(), dUnitState],
        queryFn: async () => {
            if (dPeriod === '48h') {
                const hourlyMetrics = dMetrics.filter(
                    (m): m is HourlyMetric =>
                        HOURLY_METRICS.includes(m as HourlyMetric),
                )
                const response: HourlyResponse = await fetchHourlyWeather({
                    city: dCity,
                    metrics: hourlyMetrics,
                })
                return formatHourlyData(response, dUnitState)
            } else {
                const dailyMetrics = dMetrics.filter(
                    (m): m is DailyMetric =>
                        DAILY_METRICS.includes(m as DailyMetric),
                )
                const response: DailyResponse = await fetchDailyWeather({
                    city: dCity,
                    metrics: dailyMetrics,
                })
                return formatDailyData(response, dUnitState)
            }
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: metrics.length > 0,
    })
}
