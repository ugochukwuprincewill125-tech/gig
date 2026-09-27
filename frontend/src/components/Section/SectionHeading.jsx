import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Reveal from '../Motion/Reveal'
import { cn } from '../../utils/format'

export default function SectionHeading({ eyebrow, title, subtitle, link, align = 'left', className, dark = false }) {
  return (
    <Reveal className={cn('mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between', align === 'center' && 'items-center text-center sm:flex-col sm:items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className={cn('text-2xl font-bold sm:text-3xl lg:text-[2.1rem]', dark ? 'text-white' : 'text-ink-900')}>{title}</h2>
        {subtitle && <p className={cn('mt-3 text-sm leading-relaxed sm:text-base', dark ? 'text-metal-300' : 'text-metal-500')}>{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className={cn('group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold', dark ? 'text-white' : 'text-ink-900')}
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </Reveal>
  )
}
