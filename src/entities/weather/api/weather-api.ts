import { CITIES } from '../constants/cities'
import {
  City,
  DailyResponse,
  HourlyMetric,
  HourlyResponse,
} from '../model/types'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export type FetchHourlyParams = {
  city: City
  metrics: HourlyMetric[]
}

export type FetchDailyParams = {
  city: City
}

export const fetchHourlyWeather = async ({
  city,
  metrics,
}: FetchHourlyParams): Promise<HourlyResponse> => {
  const { lat, lon } = CITIES[city]
  const metricsParam = metrics.join(',')

  const url = new URL(OPEN_METEO_BASE_URL)
  url.searchParams.append('latitude', lat.toString())
  url.searchParams.append('longitude', lon.toString())
  url.searchParams.append('hourly', metricsParam)
  url.searchParams.append('forecast_days', '2')
  url.searchParams.append('timezone', 'auto')
  url.searchParams.append('temperature_unit', 'celsius')

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error('Failed to fetch hourly weather data')
  }
  return res.json()
}

export const fetchDailyWeather = async ({
  city,
}: FetchDailyParams): Promise<DailyResponse> => {
  const { lat, lon } = CITIES[city]

  const url = new URL(OPEN_METEO_BASE_URL)
  url.searchParams.append('latitude', lat.toString())
  url.searchParams.append('longitude', lon.toString())
  url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min')
  url.searchParams.append('forecast_days', '7')
  url.searchParams.append('timezone', 'auto')
  url.searchParams.append('temperature_unit', 'celsius')

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error('Failed to fetch daily weather data')
  }
  return res.json()
}
