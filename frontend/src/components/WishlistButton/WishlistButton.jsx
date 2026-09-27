import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'

import { useWishlist } from '../../context/WishlistContext'
import { cn } from '../../utils/format'

/** Heart toggle with a pop + burst animation. */
export default function WishlistButton({ product, className, size = 'md', withLabel = false }) {
  const { has, toggle, pending } = useWishlist()
  const saved = has(product.id)
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(product)
      }}
      whileTap={{ scale: 0.85 }}
      disabled={pending === product.id}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-colors',
        withLabel ? 'h-12 gap-2 border border-metal-200 bg-white px-5 text-sm font-semibold hover:border-ink-900' : cn(dim, 'bg-white/95 shadow-sm hover:bg-white'),
        className,
      )}
    >
      <span className="relative">
        <motion.span key={saved ? 'on' : 'off'} initial={{ scale: 0.6 }} animate={{ scale: [0.6, 1.25, 1] }} transition={{ duration: 0.35 }} className="block">
          <Heart className={cn('h-[18px] w-[18px]', saved ? 'fill-red-500 text-red-500' : 'text-ink-900')} strokeWidth={2} />
        </motion.span>
        <AnimatePresence>
          {saved && (
            <motion.span
              key="burst"
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-red-400"
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </span>
      {withLabel && <span>{saved ? 'Saved' : 'Add to Wishlist'}</span>}
    </motion.button>
  )
}
