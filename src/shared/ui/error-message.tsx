import { AlertCircle, RefreshCw } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={twMerge('flex flex-col items-center justify-center p-6 text-center text-red-600 bg-red-50 rounded-lg', className)}>
      <AlertCircle size={32} className="mb-2" />
      <p className="font-medium text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
        >
          <RefreshCw size={16} />
          再試行
        </button>
      )}
    </div>
  )
}
