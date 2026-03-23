import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Shared/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'チェックボックス',
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

import { useState, ComponentProps } from 'react'

const CheckboxWrapper = (args: ComponentProps<typeof Checkbox>) => {
  const [checked, setChecked] = useState(args.checked || false)
  return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
}

export const Default: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    checked: false,
  },
}

export const Checked: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: '無効なチェックボックス',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: '無効（チェック済み）',
  },
}
