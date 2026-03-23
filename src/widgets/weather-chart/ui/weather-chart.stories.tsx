import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeatherChartWidget } from './weather-chart'
import type { ChartDataPoint } from '@/entities/weather/model/types'
import { addHours, format, parseISO } from 'date-fns'

const meta = {
  title: 'Widgets/WeatherChartWidget',
  component: WeatherChartWidget,
  parameters: {
    layout: 'padded',
  },
  args: {
    onRetry: () => console.log('Retry clicked'),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WeatherChartWidget>

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

export const Loading: Story = {
  args: {
    isLoading: true,
    isError: false,
    data: [],
    metrics: ['temperature_2m'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const Error: Story = {
  args: {
    isLoading: false,
    isError: true,
    data: [],
    metrics: ['temperature_2m'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const EmptyMetrics: Story = {
  args: {
    isLoading: false,
    isError: false,
    data: mockHourlyData,
    metrics: [],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const EmptyData: Story = {
  args: {
    isLoading: false,
    isError: false,
    data: [],
    metrics: ['temperature_2m'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}

export const Success: Story = {
  args: {
    isLoading: false,
    isError: false,
    data: mockHourlyData,
    metrics: ['temperature_2m', 'precipitation'],
    period: '48h',
    unitState: { temp: 'C', wind: 'ms' },
  },
}
