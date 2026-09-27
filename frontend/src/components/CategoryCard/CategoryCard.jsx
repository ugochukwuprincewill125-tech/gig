import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { categoryIcon } from '../../utils/icons'
import { cn } from '../../utils/format'

export default function CategoryCard({ category, variant = 'tile', className }) {
  const Icon = categoryIcon(category.icon)

  if (variant === 'compact') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className={cn('group flex items-center gap-3 rounded-2xl border border-metal-100 bg-white p-3 transition hover:border-ink-900 hover:shadow-card', className)}
      >
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-metal-50 text-ink-900 transition group-hover:bg-ink-900 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{category.name}</span>
          <span className="text-xs text-metal-400">{category.product_count} products</span>
        </span>
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className={className}>
      <Link
        to={`/category/${category.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-ink-900 p-5 text-white shadow-card transition-shadow hover:shadow-lift"
      >
        {category.image && (
          <img
            src={category.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain object-right p-3 opacity-80 transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/50 to-transparent" />
        <div className="relative flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-inset ring-white/15">
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="relative mt-auto pt-20 sm:pt-24">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="mt-1 text-xs text-metal-300">{category.product_count} products</p>
        </div>
      </Link>
    </motion.div>
  )
}
