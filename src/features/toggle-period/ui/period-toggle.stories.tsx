import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeriodToggle } from './period-toggle'
import { useState } from 'react'
import { Period } from '@/entities/weather'

const meta: Meta<typeof PeriodToggle> = {
  title: 'Features/PeriodToggle',
  component: PeriodToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PeriodToggle>

const PeriodToggleWrapper = () => {
  const [period, setPeriod] = useState<Period>('48h')
  return <PeriodToggle value={period} onChange={setPeriod} />
}

export const Default: Story = {
  render: () => <PeriodToggleWrapper />,
}
