import { describe, it, expect, beforeEach } from 'vitest'
import { useWeatherStore } from './weather-store'

describe('weather-store', () => {
    beforeEach(() => {
        // ストアを初期状態にリセット
        useWeatherStore.setState({
            city: 'tokyo',
            period: '48h',
            metrics: ['temperature_2m'],
            unitState: { temp: 'C', wind: 'ms' },
        })
        localStorage.clear()
    })

    describe('初期状態', () => {
        it('デフォルト値が正しくセットされていること', () => {
            const state = useWeatherStore.getState()
            expect(state.city).toBe('tokyo')
            expect(state.period).toBe('48h')
            expect(state.metrics).toEqual(['temperature_2m'])
            expect(state.unitState).toEqual({ temp: 'C', wind: 'ms' })
        })
    })

    describe('setCity', () => {
        it('都市を変更できること', () => {
            useWeatherStore.getState().setCity('osaka')
            expect(useWeatherStore.getState().city).toBe('osaka')
        })

        it('全ての都市に変更できること', () => {
            const cities = [
                'tokyo',
                'osaka',
                'sapporo',
                'fukuoka',
                'naha',
            ] as const
            for (const city of cities) {
                useWeatherStore.getState().setCity(city)
                expect(useWeatherStore.getState().city).toBe(city)
            }
        })
    })

    describe('setPeriod', () => {
        it('48hから7dに切り替えた場合、hourly指標が除外されdaily指標がセットされること', () => {
            useWeatherStore.setState({
                metrics: ['temperature_2m', 'precipitation'],
            })
            useWeatherStore.getState().setPeriod('7d')

            const state = useWeatherStore.getState()
            expect(state.period).toBe('7d')
            // hourly指標は全て除外されるため、デフォルトのdaily指標がセットされる
            expect(state.metrics).toEqual(['temperature_2m_max'])
        })

        it('7dから48hに切り替えた場合、daily指標が除外されhourly指標がセットされること', () => {
            useWeatherStore.setState({
                period: '7d',
                metrics: ['temperature_2m_max', 'temperature_2m_min'],
            })
            useWeatherStore.getState().setPeriod('48h')

            const state = useWeatherStore.getState()
            expect(state.period).toBe('48h')
            // daily指標は全て除外されるため、デフォルトのhourly指標がセットされる
            expect(state.metrics).toEqual(['temperature_2m'])
        })

        it('同じ期間に切り替えても指標は保持されること', () => {
            useWeatherStore.setState({
                metrics: ['temperature_2m', 'precipitation'],
            })
            useWeatherStore.getState().setPeriod('48h')

            expect(useWeatherStore.getState().metrics).toEqual([
                'temperature_2m',
                'precipitation',
            ])
        })
    })

    describe('setMetrics', () => {
        it('指標を変更できること', () => {
            useWeatherStore
                .getState()
                .setMetrics(['temperature_2m', 'windspeed_10m'])
            expect(useWeatherStore.getState().metrics).toEqual([
                'temperature_2m',
                'windspeed_10m',
            ])
        })

        it('空配列をセットできること', () => {
            useWeatherStore.getState().setMetrics([])
            expect(useWeatherStore.getState().metrics).toEqual([])
        })
    })

    describe('setTempUnit', () => {
        it('温度単位をFに変更できること', () => {
            useWeatherStore.getState().setTempUnit('F')
            expect(useWeatherStore.getState().unitState.temp).toBe('F')
            // 風速単位は変わらないこと
            expect(useWeatherStore.getState().unitState.wind).toBe('ms')
        })

        it('温度単位をCに戻せること', () => {
            useWeatherStore.getState().setTempUnit('F')
            useWeatherStore.getState().setTempUnit('C')
            expect(useWeatherStore.getState().unitState.temp).toBe('C')
        })
    })

    describe('setWindUnit', () => {
        it('風速単位をkmhに変更できること', () => {
            useWeatherStore.getState().setWindUnit('kmh')
            expect(useWeatherStore.getState().unitState.wind).toBe('kmh')
            // 温度単位は変わらないこと
            expect(useWeatherStore.getState().unitState.temp).toBe('C')
        })

        it('風速単位をmsに戻せること', () => {
            useWeatherStore.getState().setWindUnit('kmh')
            useWeatherStore.getState().setWindUnit('ms')
            expect(useWeatherStore.getState().unitState.wind).toBe('ms')
        })
    })

    describe('localStorage永続化', () => {
        it('状態がlocalStorageに保存されること', () => {
            useWeatherStore.getState().setCity('fukuoka')
            useWeatherStore.getState().setTempUnit('F')

            const stored = localStorage.getItem('weather-store')
            expect(stored).not.toBeNull()

            const parsed = JSON.parse(stored!)
            expect(parsed.state.city).toBe('fukuoka')
            expect(parsed.state.unitState.temp).toBe('F')
        })
    })
})
