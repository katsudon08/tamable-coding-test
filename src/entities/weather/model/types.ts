export type BaseResponse = {
  latitude: number
  longitude: number
  timezone: string
}

export type HourlyResponse = BaseResponse & {
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    precipitation: number[]
    windspeed_10m: number[]
  }
}

export type DailyResponse = BaseResponse & {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export type City = 'tokyo' | 'osaka' | 'sapporo' | 'fukuoka' | 'naha'
export type Period = '48h' | '7d'

export type HourlyMetric =
  | 'temperature_2m'
  | 'apparent_temperature'
  | 'precipitation'
  | 'windspeed_10m'
export type DailyMetric = 'temperature_2m_max' | 'temperature_2m_min'
export type Metric = HourlyMetric | DailyMetric

export type UnitState = {
  temp: 'C' | 'F'
  wind: 'ms' | 'kmh'
}

export type ChartDataPoint = {
  time: string
  temperature_2m?: number
  apparent_temperature?: number
  precipitation?: number
  windspeed_10m?: number
  temperature_2m_max?: number
  temperature_2m_min?: number
}
