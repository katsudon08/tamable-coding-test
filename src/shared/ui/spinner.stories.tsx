import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'

const meta = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = {
  args: {
    size: 48,
  },
}
