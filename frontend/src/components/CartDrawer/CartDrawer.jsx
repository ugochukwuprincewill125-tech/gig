import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import useLockBody from '../../hooks/useLockBody'
import useStoreInfo from '../../hooks/useStoreInfo'
import { formatNaira } from '../../utils/format'
import Button from '../Button/Button'
import QuantitySelector from '../QuantitySelector/QuantitySelector'

export function CartLine({ item, compact = false }) {
  const { updateItem, removeItem, pending } = useCart()
  const busy = pending === item.id
  const { product } = item
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: busy ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, x: -24, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3.5 py-4 sm:gap-4"
    >
      <Link to={`/products/${product.slug}`} className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-metal-50 sm:h-24 sm:w-24">
        {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-ink-900 hover:text-brand-600">
              {product.name}
            </Link>
            {item.selected_variant && <p className="mt-0.5 text-xs text-metal-500">{item.selected_variant.label}</p>}
            {!compact && <p className="mt-0.5 text-xs text-metal-400">{formatNaira(item.unit_price)} each</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            disabled={busy}
            className="rounded-lg p-1.5 text-metal-400 transition hover:bg-red-50 hover:text-danger"
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {item.issue && <p className="mt-1 text-xs font-medium text-danger">{item.issue}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={Math.max(1, item.available_stock)}
            disabled={busy}
            onChange={(q) => updateItem(item.id, q)}
          />
          <p className="text-sm font-bold">{formatNaira(item.line_total)}</p>
        </div>
      </div>
    </motion.li>
  )
}

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, items, itemCount, subtotal } = useCart()
  const { shipping } = useStoreInfo()
  const { pathname } = useLocation()
  useLockBody(drawerOpen)

  useEffect(() => {
    closeDrawer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, closeDrawer])

  const threshold = shipping?.free_shipping_threshold
  const remaining = threshold ? Math.max(0, threshold - Number(subtotal)) : null

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-metal-100 px-5 py-4">
              <h2 className="text-lg font-semibold">
                Your cart <span className="text-metal-400">({itemCount})</span>
              </h2>
              <button type="button" onClick={closeDrawer} className="rounded-full p-2 transition hover:rotate-90 hover:bg-metal-100" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-metal-50">
                  <ShoppingBag className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <p className="text-lg font-semibold">Your cart is empty</p>
                <p className="mt-1.5 text-sm text-metal-500">Browse our latest phones, laptops and accessories.</p>
                <Button to="/shop" className="mt-6">
                  Start shopping
                </Button>
              </div>
            ) : (
              <>
                {remaining !== null && (
                  <div className="border-b border-metal-100 bg-metal-50/60 px-5 py-3">
                    <p className="flex items-center gap-2 text-xs text-metal-600">
                      <Truck className="h-4 w-4 text-brand-500" />
                      {remaining > 0 ? (
                        <>
                          Add <strong className="text-ink-900">{formatNaira(remaining)}</strong> more for free delivery
                        </>
                      ) : (
                        <strong className="text-success">You qualify for free delivery!</strong>
                      )}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-metal-200">
                      <motion.div
                        className="h-full rounded-full bg-brand-500"
                        initial={false}
                        animate={{ width: `${Math.min(100, (Number(subtotal) / threshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <ul className="flex-1 divide-y divide-metal-100 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartLine key={item.id} item={item} compact />
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-metal-100 p-5 pb-safe">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-metal-500">Subtotal</span>
                    <span className="text-lg font-bold">{formatNaira(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-metal-400">Delivery and discounts are calculated at checkout.</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button to="/cart" variant="outline">
                      View cart
                    </Button>
                    <Button to="/checkout" variant="primary">
                      Checkout
                    </Button>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
