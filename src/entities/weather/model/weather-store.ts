import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { City, Period, Metric, UnitState } from './types'

type WeatherState = {
    city: City
    period: Period
    metrics: Metric[]
    unitState: UnitState
}

type WeatherActions = {
    setCity: (city: City) => void
    setPeriod: (period: Period) => void
    setMetrics: (metrics: Metric[]) => void
    setTempUnit: (unit: UnitState['temp']) => void
    setWindUnit: (unit: UnitState['wind']) => void
}

export type WeatherStore = WeatherState & WeatherActions

const DEFAULT_STATE: WeatherState = {
    city: 'tokyo',
    period: '48h',
    metrics: ['temperature_2m'],
    unitState: { temp: 'C', wind: 'ms' },
}

export const useWeatherStore = create<WeatherStore>()(
    persist(
        (set) => ({
            ...DEFAULT_STATE,
            setCity: (city) => set({ city }),
            setPeriod: (period) =>
                set((state) => {
                    // 期間切り替え時に、新しい期間で有効でない指標を除外する
                    const hourlyMetrics: Metric[] = [
                        'temperature_2m',
                        'apparent_temperature',
                        'precipitation',
                        'windspeed_10m',
                    ]
                    const dailyMetrics: Metric[] = [
                        'temperature_2m_max',
                        'temperature_2m_min',
                    ]
                    const validMetrics =
                        period === '48h' ? hourlyMetrics : dailyMetrics
                    const filteredMetrics = state.metrics.filter((m) =>
                        validMetrics.includes(m),
                    )
                    return {
                        period,
                        metrics:
                            filteredMetrics.length > 0
                                ? filteredMetrics
                                : period === '48h'
                                  ? ['temperature_2m']
                                  : ['temperature_2m_max'],
                    }
                }),
            setMetrics: (metrics) => set({ metrics }),
            setTempUnit: (unit) =>
                set((state) => ({
                    unitState: { ...state.unitState, temp: unit },
                })),
            setWindUnit: (unit) =>
                set((state) => ({
                    unitState: { ...state.unitState, wind: unit },
                })),
        }),
        {
            name: 'weather-store',
        },
    ),
)
