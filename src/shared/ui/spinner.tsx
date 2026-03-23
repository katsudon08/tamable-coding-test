import { Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface SpinnerProps {
  className?: string
  size?: number
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <div className={twMerge('flex items-center justify-center', className)}>
      <Loader2 size={size} className="animate-spin text-slate-500" />
    </div>
  )
}
