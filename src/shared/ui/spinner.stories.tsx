import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 48,
  },
};
