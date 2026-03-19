import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './select'

const meta: Meta<typeof Select> = {
  title: 'Shared/UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select className="w-64">
      <option value="tokyo">東京</option>
      <option value="osaka">大阪</option>
      <option value="sapporo">札幌</option>
    </Select>
  ),
};
