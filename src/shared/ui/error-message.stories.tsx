import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorMessage } from './error-message'

const meta: Meta<typeof ErrorMessage> = {
  title: 'Shared/UI/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'データの取得に失敗しました。',
  },
};

export const WithRetry: Story = {
  args: {
    message: 'サーバーとの通信がタイムアウトしました。',
    onRetry: () => alert('リトライ処理を実行します'),
  },
};
