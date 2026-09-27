import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Brands are shown as typographic cards. Upload approved brand logos in the
 * Django admin (Brands → logo) if you have permission to display them.
 */
export default function BrandCard({ brand }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <Link
        to={`/brands/${brand.slug}`}
        className="group flex h-full flex-col rounded-3xl border border-metal-100 bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
      >
        <div className="flex h-16 items-center">
          <span className="font-display text-2xl font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">{brand.name}</span>
        </div>
        {brand.description && <p className="mt-2 line-clamp-2 text-sm text-metal-500">{brand.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <span className="text-metal-400">{brand.product_count} products</span>
          <span className="flex items-center gap-1 font-semibold text-ink-900">
            Shop <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
