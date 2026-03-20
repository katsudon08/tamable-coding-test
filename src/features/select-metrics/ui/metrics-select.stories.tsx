import type { Meta, StoryObj } from '@storybook/react'
import { MetricsSelect } from './metrics-select'
import { useState } from 'react'
import { Metric, Period } from '@/entities/weather/model/types'

const meta: Meta<typeof MetricsSelect> = {
  title: 'Features/MetricsSelect',
  component: MetricsSelect,
  tags: ['autodocs'],
  args: {
    period: '48h',
  },
}

export default meta
type Story = StoryObj<typeof MetricsSelect>

const MetricsSelectWrapper = ({ period }: { period: Period }) => {
  const [metrics, setMetrics] = useState<Metric[]>([])
  return <MetricsSelect period={period} value={metrics} onChange={setMetrics} />
}

export const Hourly: Story = {
  render: () => <MetricsSelectWrapper period="48h" />,
}

export const Daily: Story = {
  render: () => <MetricsSelectWrapper period="7d" />,
}
