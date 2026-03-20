import { Toggle } from '@/shared/ui/toggle'
import { UnitState } from '@/entities/weather/model/types'
import { TEMP_UNIT, WIND_UNIT } from '@/entities/weather/constants/units'

interface UnitToggleProps {
  tempUnit: UnitState['temp']
  windUnit: UnitState['wind']
  onTempChange: (unit: UnitState['temp']) => void
  onWindChange: (unit: UnitState['wind']) => void
  className?: string
}

export function UnitToggle({ tempUnit, windUnit, onTempChange, onWindChange, className }: UnitToggleProps) {
  return (
    <div className={className}>
      <span className="block text-sm font-medium text-slate-700 mb-2">表示単位</span>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Toggle
          checked={tempUnit === TEMP_UNIT.FAHRENHEIT}
          onChange={(checked) => onTempChange(checked ? TEMP_UNIT.FAHRENHEIT : TEMP_UNIT.CELSIUS)}
          label={`気温: °${tempUnit}`}
        />
        <Toggle
          checked={windUnit === WIND_UNIT.KMH}
          onChange={(checked) => onWindChange(checked ? WIND_UNIT.KMH : WIND_UNIT.MS)}
          label={`風速: ${windUnit === WIND_UNIT.KMH ? 'km/h' : 'm/s'}`}
        />
      </div>
    </div>
  )
}
