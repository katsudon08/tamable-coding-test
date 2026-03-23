import { useWeatherStore, useWeatherQuery } from '@/entities/weather'
import { ControlPanel } from '@/widgets/control-panel'
import { WeatherChart } from '@/widgets/weather-chart'

export function WeatherPage() {
    const {
        city,
        period,
        metrics,
        unitState,
        setCity,
        setPeriod,
        setMetrics,
        setTempUnit,
        setWindUnit,
    } = useWeatherStore()

    const { data, isLoading, isError, refetch } = useWeatherQuery(
        city,
        period,
        metrics,
        unitState,
    )

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        天気ダッシュボード
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
                <ControlPanel
                    city={city}
                    onCityChange={setCity}
                    period={period}
                    onPeriodChange={setPeriod}
                    metrics={metrics}
                    onMetricsChange={setMetrics}
                    tempUnit={unitState.temp}
                    onTempUnitChange={setTempUnit}
                    windUnit={unitState.wind}
                    onWindUnitChange={setWindUnit}
                />

                <WeatherChart
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={() => refetch()}
                    data={data ?? []}
                    metrics={metrics}
                    period={period}
                    unitState={unitState}
                />
            </main>
        </div>
    )
}
