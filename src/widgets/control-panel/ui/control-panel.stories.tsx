import type { Meta, StoryObj } from '@storybook/react-vite'
import { ControlPanel } from './control-panel'
import { useState } from 'react'
import { City, Metric, Period, UnitState } from '@/entities/weather'

const meta: Meta<typeof ControlPanel> = {
  title: 'Widgets/ControlPanel',
  component: ControlPanel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ControlPanel>

const ControlPanelWrapper = () => {
  const [city, setCity] = useState<City>('tokyo')
  const [period, setPeriod] = useState<Period>('48h')
  const [metrics, setMetrics] = useState<Metric[]>(['temperature_2m'])
  const [tempUnit, setTempUnit] = useState<UnitState['temp']>('C')
  const [windUnit, setWindUnit] = useState<UnitState['wind']>('ms')

  return (
    <ControlPanel
      city={city}
      onCityChange={setCity}
      period={period}
      onPeriodChange={(newPeriod) => {
        setPeriod(newPeriod)
        // 期間が変わったら選択指標をリセットするモック挙動
        setMetrics(newPeriod === '48h' ? ['temperature_2m'] : ['temperature_2m_max'])
      }}
      metrics={metrics}
      onMetricsChange={setMetrics}
      tempUnit={tempUnit}
      onTempUnitChange={setTempUnit}
      windUnit={windUnit}
      onWindUnitChange={setWindUnit}
    />
  )
}

export const Default: Story = {
  render: () => <ControlPanelWrapper />,
}
