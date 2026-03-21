import { WeatherChart as EntityWeatherChart } from '@/entities/weather'
import { Spinner } from '@/shared/ui/spinner'
import { ErrorMessage } from '@/shared/ui/error-message'
import { EmptyState } from '@/shared/ui/empty-state'
import type { ChartDataPoint, Metric, Period, UnitState } from '@/entities/weather/model/types'

export type WeatherChartWidgetProps = {
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  data: ChartDataPoint[]
  metrics: Metric[]
  period: Period
  unitState: UnitState
}

export function WeatherChartWidget({
  isLoading,
  isError,
  onRetry,
  data,
  metrics,
  period,
  unitState,
}: WeatherChartWidgetProps) {
  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
        <Spinner size={48} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-4">
        <ErrorMessage message="天気データの読み込みに失敗しました" onRetry={onRetry} />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
        <EmptyState 
          title="データがありません" 
          description="選択された条件のデータが見つかりませんでした。"
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-full">
      <EntityWeatherChart 
        data={data}
        metrics={metrics}
        period={period}
        unitState={unitState}
      />
    </div>
  )
}
