import { Minus, Plus } from 'lucide-react'

import { cn } from '../../utils/format'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, disabled, size = 'md', label = 'Quantity' }) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-11'
  return (
    <div className={cn('inline-flex items-center rounded-xl border border-metal-200 bg-white', h)} role="group" aria-label={label}>
      <button
        type="button"
        className={cn('flex h-full items-center justify-center text-ink-900 transition hover:bg-metal-50 disabled:opacity-30', w, 'rounded-l-xl')}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={cn('min-w-8 text-center text-sm font-semibold tabular-nums', size === 'sm' ? 'px-1' : 'px-2')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn('flex h-full items-center justify-center text-ink-900 transition hover:bg-metal-50 disabled:opacity-30', w, 'rounded-r-xl')}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
