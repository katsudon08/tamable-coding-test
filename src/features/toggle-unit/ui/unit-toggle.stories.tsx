import type { Meta, StoryObj } from '@storybook/react-vite'
import { UnitToggle } from './unit-toggle'
import { useState } from 'react'
import { UnitState } from '@/entities/weather'

const meta: Meta<typeof UnitToggle> = {
  title: 'Features/UnitToggle',
  component: UnitToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UnitToggle>

const UnitToggleWrapper = () => {
  const [temp, setTemp] = useState<UnitState['temp']>('C')
  const [wind, setWind] = useState<UnitState['wind']>('ms')
  return (
    <UnitToggle
      tempUnit={temp}
      windUnit={wind}
      onTempChange={setTemp}
      onWindChange={setWind}
    />
  )
}

export const Default: Story = {
  render: () => <UnitToggleWrapper />,
}
