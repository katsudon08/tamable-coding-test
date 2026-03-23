import { twMerge } from 'tailwind-merge'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={twMerge('inline-flex items-center cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-slate-700">{label}</span>}
    </label>
  )
}
