import { UnitState } from '../model/types'

export const TEMP_UNIT: Record<'CELSIUS' | 'FAHRENHEIT', UnitState['temp']> = {
  CELSIUS: 'C',
  FAHRENHEIT: 'F',
} as const

export const WIND_UNIT: Record<'MS' | 'KMH', UnitState['wind']> = {
  MS: 'ms',
  KMH: 'kmh',
} as const
