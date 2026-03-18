import { Inbox } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div className={twMerge('flex flex-col items-center justify-center p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50', className)}>
      <div className="text-slate-400 mb-3">
        {icon || <Inbox size={48} />}
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm mt-1 max-w-sm">{description}</p>}
    </div>
  )
}
