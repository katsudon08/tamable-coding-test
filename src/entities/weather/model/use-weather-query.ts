import { useQuery } from '@tanstack/react-query'
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
    return useQuery<ChartDataPoint[]>({
        queryKey: ['weather', city, period, [...metrics].sort(), unitState],
        queryFn: async () => {
            if (period === '48h') {
                const hourlyMetrics = metrics.filter(
                    (m): m is HourlyMetric =>
                        HOURLY_METRICS.includes(m as HourlyMetric),
                )
                const response: HourlyResponse = await fetchHourlyWeather({
                    city,
                    metrics: hourlyMetrics,
                })
                return formatHourlyData(response, unitState)
            } else {
                const dailyMetrics = metrics.filter(
                    (m): m is DailyMetric =>
                        DAILY_METRICS.includes(m as DailyMetric),
                )
                const response: DailyResponse = await fetchDailyWeather({
                    city,
                    metrics: dailyMetrics,
                })
                return formatDailyData(response, unitState)
            }
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: metrics.length > 0,
    })
}
