import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/format'

export default function Breadcrumbs({ items, className, dark = false }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xs sm:text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className={cn('transition-colors', dark ? 'text-metal-300 hover:text-white' : 'text-metal-500 hover:text-ink-900')}>
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label + i} className="flex items-center gap-1.5">
            <ChevronRight className={cn('h-3.5 w-3.5', dark ? 'text-metal-400' : 'text-metal-300')} aria-hidden />
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className={cn('transition-colors', dark ? 'text-metal-300 hover:text-white' : 'text-metal-500 hover:text-ink-900')}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn('line-clamp-1 font-medium', dark ? 'text-white' : 'text-ink-900')}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
