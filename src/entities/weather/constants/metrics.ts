import { Metric } from '../model/types'

export const METRICS: Record<
  Metric,
  { label: string; defaultUnit?: string; isDailyOnly?: boolean }
> = {
  temperature_2m: { label: '気温' },
  apparent_temperature: { label: '体感温度' },
  precipitation: { label: '降水量', defaultUnit: 'mm' },
  windspeed_10m: { label: '風速' },
  temperature_2m_max: { label: '最高気温', isDailyOnly: true },
  temperature_2m_min: { label: '最低気温', isDailyOnly: true },
}
