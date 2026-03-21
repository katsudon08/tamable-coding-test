import type { Meta, StoryObj } from '@storybook/react-vite'
import { CitySelect } from './city-select'
import { useState } from 'react'
import { City } from '@/entities/weather'

const meta: Meta<typeof CitySelect> = {
  title: 'Features/SelectCity',
  component: CitySelect,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CitySelect>

const CitySelectWrapper = () => {
  const [city, setCity] = useState<City>('tokyo')
  return <CitySelect value={city} onChange={setCity} />
}

export const Default: Story = {
  render: () => <CitySelectWrapper />,
}
