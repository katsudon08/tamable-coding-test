import { Metric, Period } from '../model/types'

export const METRICS: Record<
  Metric,
  { label: string; defaultUnit?: string; period: Period }
> = {
  temperature_2m: { label: '気温', period: '48h' },
  apparent_temperature: { label: '体感温度', period: '48h' },
  precipitation: { label: '降水量', defaultUnit: 'mm', period: '48h' },
  windspeed_10m: { label: '風速', period: '48h' },
  temperature_2m_max: { label: '最高気温', period: '7d' },
  temperature_2m_min: { label: '最低気温', period: '7d' },
}
