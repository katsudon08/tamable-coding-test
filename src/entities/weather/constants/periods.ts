import { Period } from '../model/types'

export const PERIOD: Record<'HOURLY' | 'DAILY', Period> = {
  HOURLY: '48h',
  DAILY: '7d',
} as const
