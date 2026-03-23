import { City, Metric, Period, UnitState } from '@/entities/weather'
import { CitySelect } from '@/features/select-city'
import { MetricsSelect } from '@/features/select-metrics'
import { PeriodToggle } from '@/features/toggle-period'
import { UnitToggle } from '@/features/toggle-unit'

export interface ControlPanelProps {
  city: City
  onCityChange: (city: City) => void
  period: Period
  onPeriodChange: (period: Period) => void
  metrics: Metric[]
  onMetricsChange: (metrics: Metric[]) => void
  tempUnit: UnitState['temp']
  onTempUnitChange: (unit: UnitState['temp']) => void
  windUnit: UnitState['wind']
  onWindUnitChange: (unit: UnitState['wind']) => void
  className?: string
}

export function ControlPanel({
  city,
  onCityChange,
  period,
  onPeriodChange,
  metrics,
  onMetricsChange,
  tempUnit,
  onTempUnitChange,
  windUnit,
  onWindUnitChange,
  className,
}: ControlPanelProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200 ${className || ''}`}>
      <h2 className="text-lg font-bold text-slate-800 mb-6">表示設定</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側カラム：都市と期間 */}
        <div className="flex flex-col gap-6">
          <CitySelect value={city} onChange={onCityChange} />
          <PeriodToggle value={period} onChange={onPeriodChange} />
          <UnitToggle
            tempUnit={tempUnit}
            windUnit={windUnit}
            onTempChange={onTempUnitChange}
            onWindChange={onWindUnitChange}
          />
        </div>

        {/* 右側カラム：表示指標 */}
        <div className="flex flex-col gap-6">
          <MetricsSelect
            period={period}
            value={metrics}
            onChange={onMetricsChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
