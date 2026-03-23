import { City } from '../model/types'

export const CITIES: Record<City, { label: string; lat: number; lon: number }> = {
  tokyo: { label: '東京', lat: 35.6895, lon: 139.6917 },
  osaka: { label: '大阪', lat: 34.6937, lon: 135.5023 },
  sapporo: { label: '札幌', lat: 43.0618, lon: 141.3545 },
  fukuoka: { label: '福岡', lat: 33.5902, lon: 130.4017 },
  naha: { label: '那覇', lat: 26.2124, lon: 127.6809 },
}
