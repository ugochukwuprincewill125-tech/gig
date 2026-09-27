import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

import Button from '../Button/Button'
import { cn } from '../../utils/format'

export default function EmptyState({ icon: Icon, title, message, action, secondary, className, tone = 'default' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center', className)}
    >
      {Icon && (
        <div
          className={cn(
            'relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl',
            tone === 'error' ? 'bg-red-50 text-danger' : 'bg-metal-50 text-ink-900',
          )}
        >
          <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          <Icon className="h-9 w-9" strokeWidth={1.6} aria-hidden />
        </div>
      )}
      <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">{title}</h2>
      {message && <p className="mt-2 text-sm leading-relaxed text-metal-500 sm:text-base">{message}</p>}
      {(action || secondary) && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button to={action.to} onClick={action.onClick} variant={action.variant || 'primary'} icon={action.icon}>
              {action.label}
            </Button>
          )}
          {secondary && (
            <Button to={secondary.to} onClick={secondary.onClick} variant="outline">
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function ErrorState({ title = 'Something went wrong', message = 'We couldn’t load this right now. Please try again.', onRetry, className }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      tone="error"
      title={title}
      message={message}
      className={className}
      action={onRetry ? { label: 'Try again', onClick: onRetry, icon: RefreshCw } : { label: 'Back to home', to: '/' }}
    />
  )
}
