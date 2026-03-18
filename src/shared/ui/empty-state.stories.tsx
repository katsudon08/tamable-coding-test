import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './empty-state'
import { MapPin } from 'lucide-react'

const meta = {
  title: 'Shared/UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'データがありません',
  },
}

export const WithDescription: Story = {
  args: {
    title: '都市が選択されていません',
    description: '左側のパネルから天気を確認したい都市を選択してください。',
  },
}

export const CustomIcon: Story = {
  args: {
    title: '位置情報が不明です',
    icon: <MapPin size={48} />,
  },
}
