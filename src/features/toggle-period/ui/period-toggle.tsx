import { Toggle } from '@/shared/ui/toggle'
import { Period } from '@/entities/weather/model/types'
import { PERIOD } from '@/entities/weather/constants/periods'

interface PeriodToggleProps {
  value: Period
  onChange: (value: Period) => void
  className?: string
}

export function PeriodToggle({ value, onChange, className }: PeriodToggleProps) {
  return (
    <div className={className}>
      <span className="block text-sm font-medium text-slate-700 mb-2">表示期間</span>
      <Toggle
        checked={value === PERIOD.DAILY}
        onChange={(checked) => onChange(checked ? PERIOD.DAILY : PERIOD.HOURLY)}
        label={value === PERIOD.DAILY ? '7日間' : '48時間'}
      />
    </div>
  )
}
