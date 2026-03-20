import { Checkbox } from '@/shared/ui/checkbox'
import { Metric, Period } from '@/entities/weather/model/types'
import { METRICS } from '@/entities/weather/constants/metrics'

interface MetricsSelectProps {
  period: Period
  value: Metric[]
  onChange: (value: Metric[]) => void
  className?: string
}

export function MetricsSelect({ period, value, onChange, className }: MetricsSelectProps) {
  // 期間に基づいて表示可能な指標をフィルタリング
  const availableMetrics = (Object.entries(METRICS) as [Metric, typeof METRICS[Metric]][]).filter(
    ([, config]) => config.period === period
  )

  const handleChange = (metric: Metric, checked: boolean) => {
    if (checked) {
      onChange([...value, metric])
    } else {
      onChange(value.filter((v) => v !== metric))
    }
  }

  return (
    <div className={className}>
      <span className="block text-sm font-medium text-slate-700 mb-2">表示する指標</span>
      <div className="flex flex-wrap gap-4">
        {availableMetrics.map(([key, config]) => (
          <Checkbox
            key={key}
            label={config.label}
            checked={value.includes(key)}
            onChange={(e) => handleChange(key, e.target.checked)}
          />
        ))}
      </div>
    </div>
  )
}
