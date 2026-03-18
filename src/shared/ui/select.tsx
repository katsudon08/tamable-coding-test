import { SelectHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative inline-block w-full">
      <select
        className={twMerge(
          'w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <ChevronDown size={16} />
      </div>
    </div>
  )
}
