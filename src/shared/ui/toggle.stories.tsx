// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './toggle'
import { useState } from 'react'

const meta = {
  title: 'Shared/UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToggleWithState = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false)
  return <Toggle {...args} checked={checked} onChange={setChecked} />
}

export const Default: Story = {
  render: () => <ToggleWithState checked={false} label="温度を華氏で表示" />,
}

export const Checked: Story = {
  render: () => <ToggleWithState checked={true} label="風速を時速(km/h)で表示" />,
}
