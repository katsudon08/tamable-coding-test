import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeatherChart } from './weather-chart'
import type { ChartDataPoint } from '../model/types'
import { addHours, addDays, format, parseISO } from 'date-fns'

const meta = {
  title: 'Entities/Weather/WeatherChart',
  component: WeatherChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WeatherChart>

export default meta
type Story = StoryObj<typeof meta>

const baseDate = parseISO('2026-03-21T00:00:00')

const mockHourlyData: ChartDataPoint[] = Array.from({ length: 48 }).map((_, i) => ({
  time: format(addHours(baseDate, i), "yyyy-MM-dd'T'HH:mm"),
  temperature_2m: 15 + Math.sin(i / 4) * 5,
  apparent_temperature: 14 + Math.sin(i / 4) * 6,
  precipitation: i % 8 === 0 ? Math.random() * 5 : 0,
  windspeed_10m: 2 + Math.random() * 3,
}))

const mockDailyData: ChartDataPoint[] = Array.from({ length: 7 }).map((_, i) => ({
  time: format(addDays(baseDate, i), "yyyy-MM-dd'T'00:00"),
  temperature_2m_max: 20 + Math.random() * 5,
  temperature_2m_min: 10 + Math.random() * 5,
}))

export const HourlyAllMetrics: Story = {
  args: {
    data: mockHourlyData,
    metrics: ['temperature_2m', 'apparent_temperature', 'precipitation', 'windspeed_10m'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const HourlyTemperatureOnly: Story = {
  args: {
    data: mockHourlyData,
    metrics: ['temperature_2m'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const HourlyFahrenheitAndKmh: Story = {
  args: {
    data: mockHourlyData.map(d => ({
      ...d,
      temperature_2m: ((d.temperature_2m ?? 0) * 9/5) + 32,
      apparent_temperature: ((d.apparent_temperature ?? 0) * 9/5) + 32,
      windspeed_10m: (d.windspeed_10m ?? 0) * 3.6,
    })),
    metrics: ['temperature_2m', 'apparent_temperature', 'precipitation', 'windspeed_10m'],
    period: '48h',
    unitState: { temp: 'F', wind: 'kmh' },
  },
}

export const DailyAllMetrics: Story = {
  args: {
    data: mockDailyData,
    metrics: ['temperature_2m_max', 'temperature_2m_min'],
    period: '7d',
    unitState: { temp: 'C', wind: 'ms' },
  },
}
