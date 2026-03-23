import { Select } from '@/shared/ui/select'
import { City, CITIES } from '@/entities/weather'

interface CitySelectProps {
  value: City
  onChange: (value: City) => void
  className?: string
}

export function CitySelect({ value, onChange, className }: CitySelectProps) {
  return (
    <div className={className}>
      <label htmlFor="city-select" className="block text-sm font-medium text-slate-700 mb-1">
        都市
      </label>
      <Select
        id="city-select"
        value={value}
        onChange={(e) => onChange(e.target.value as City)}
        className="w-full sm:w-48"
      >
        {Object.entries(CITIES).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
