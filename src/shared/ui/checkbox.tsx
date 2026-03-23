import { twMerge } from 'tailwind-merge'
import { Check } from 'lucide-react'
import type { InputHTMLAttributes, Ref } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  ref?: Ref<HTMLInputElement>
}

export function Checkbox({ className, label, ref, ...props }: CheckboxProps) {
  return (
      <label className="inline-flex items-center cursor-pointer select-none">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className={twMerge(
              'peer appearance-none w-5 h-5 rounded border border-slate-300 bg-white checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors',
              className
            )}
            ref={ref}
            {...props}
          />
          <Check
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            strokeWidth={3}
          />
        </div>
        {label && <span className="ml-2 text-sm text-slate-700">{label}</span>}
      </label>
  )
}
