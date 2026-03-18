import { HourlyResponse, DailyResponse, UnitState, ChartDataPoint } from '../model/types'
import { convertTemp, convertWindSpeed } from './unit-converter'

/**
 * formatHourlyData
 * HourlyResponseをチャート描画用のChartDataPoint配列に変換する
 */
export const formatHourlyData = (data: HourlyResponse, unitState: UnitState): ChartDataPoint[] => {
  const { time, temperature_2m, apparent_temperature, precipitation, windspeed_10m } = data.hourly
  const isFahrenheit = unitState.temp === 'F'
  const isKmh = unitState.wind === 'kmh'

  return time.map((t, index) => ({
    time: t,
    temperature_2m: convertTemp(temperature_2m[index], isFahrenheit),
    apparent_temperature: convertTemp(apparent_temperature[index], isFahrenheit),
    precipitation: precipitation[index],
    windspeed_10m: convertWindSpeed(windspeed_10m[index], isKmh),
  }))
}

/**
 * formatDailyData
 * DailyResponseをチャート描画用のChartDataPoint配列に変換する
 */
export const formatDailyData = (data: DailyResponse, unitState: UnitState): ChartDataPoint[] => {
  const { time, temperature_2m_max, temperature_2m_min } = data.daily
  const isFahrenheit = unitState.temp === 'F'

  return time.map((t, index) => ({
    time: t,
    temperature_2m_max: convertTemp(temperature_2m_max[index], isFahrenheit),
    temperature_2m_min: convertTemp(temperature_2m_min[index], isFahrenheit),
  }))
}
