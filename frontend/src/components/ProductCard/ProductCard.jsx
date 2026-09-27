import { motion } from 'framer-motion'
import { Eye, LoaderCircle, ShoppingBag } from 'lucide-react'
import { memo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import { cn, formatNaira } from '../../utils/format'
import Rating from '../Rating/Rating'
import WishlistButton from '../WishlistButton/WishlistButton'

export function ProductBadges({ product, className }) {
  const soldOut = product.availability === 'out_of_stock'
  return (
    <div className={cn('flex flex-col items-start gap-1.5', className)}>
      {soldOut ? (
        <span className="chip bg-ink-900 text-white">Sold out</span>
      ) : (
        <>
          {product.discount_percent > 0 && <span className="chip bg-brand-500 text-white">-{product.discount_percent}%</span>}
          {product.new_arrival && <span className="chip bg-white text-ink-900 shadow-sm">New</span>}
          {product.availability === 'low_stock' && <span className="chip bg-amber-100 text-amber-800">Low stock</span>}
        </>
      )}
    </div>
  )
}

function ProductCard({ product, onQuickView, priority = false }) {
  const { addItem, pending } = useCart()
  const [loaded, setLoaded] = useState(false)
  const soldOut = product.availability === 'out_of_stock'
  const adding = pending === product.id
  const url = `/products/${product.slug}`

  const handleAdd = (e) => {
    e.preventDefault()
    if (soldOut) return
    if (product.has_variants && onQuickView) onQuickView(product)
    else addItem(product, 1).catch(() => {})
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col rounded-2xl border border-metal-100 bg-white p-2.5 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-3"
    >
      <Link to={url} className="relative block overflow-hidden rounded-xl bg-metal-50" aria-label={product.name}>
        <div className="aspect-square">
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                ref={(el) => {
                  if (el && el.complete && el.naturalWidth && !loaded) setLoaded(true)
                }}
                className={cn(
                  'h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]',
                  loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
                  product.hover_image && 'group-hover:opacity-0',
                )}
              />
              {product.hover_image && (
                <img
                  src={product.hover_image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-metal-400">Image coming soon</div>
          )}
        </div>
        <ProductBadges product={product} className="absolute left-2.5 top-2.5" />

        {onQuickView && (
          <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur transition hover:bg-ink-900 hover:text-white"
            >
              <Eye className="h-4 w-4" aria-hidden /> Quick view
            </button>
          </div>
        )}
      </Link>

      <div className="absolute right-4 top-4 transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:[&:has([aria-pressed=true])]:translate-y-0 md:[&:has([aria-pressed=true])]:opacity-100 sm:right-5 sm:top-5">
        <WishlistButton product={product} size="sm" />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:pt-4">
        {product.brand && <p className="text-[11px] font-semibold uppercase tracking-wider text-metal-400">{product.brand.name}</p>}
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 text-ink-900 sm:text-sm">
          <Link to={url} className="hover:text-brand-600">
            {product.name}
          </Link>
        </h3>
        {Number(product.review_count) > 0 ? (
          <Rating value={product.rating} count={product.review_count} size="h-3.5 w-3.5" className="mt-1.5" />
        ) : (
          <span className="mt-1.5 h-4 text-xs text-metal-400">No reviews yet</span>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink-900 sm:text-base">{formatNaira(product.current_price)}</p>
            {product.discount_price && <p className="text-xs text-metal-400 line-through">{formatNaira(product.price)}</p>}
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={soldOut || adding}
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            className={cn(
              'flex h-10 w-10 flex-none items-center justify-center rounded-xl transition-colors',
              soldOut ? 'cursor-not-allowed bg-metal-100 text-metal-400' : 'bg-ink-900 text-white hover:bg-brand-500',
            )}
          >
            {adding ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(ProductCard)
