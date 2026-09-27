import { AnimatePresence } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, Lock, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs'
import Button from '../../components/Button/Button'
import { CartLine } from '../../components/CartDrawer/CartDrawer'
import EmptyState, { ErrorState } from '../../components/EmptyState/EmptyState'
import { Skeleton } from '../../components/Loader/Skeleton'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Seo from '../../components/Seo/Seo'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import useCheckoutPrefs from '../../hooks/useCheckoutPrefs'
import useQuote from '../../hooks/useQuote'
import useStoreInfo from '../../hooks/useStoreInfo'
import { errorMessage } from '../../services/api'
import { cartService } from '../../services/cartService'

export default function Cart() {
  const { items, itemCount, isLoading, isError, refresh, clearCart, hasIssues } = useCart()
  const { states } = useStoreInfo()
  const [prefs, setPrefs] = useCheckoutPrefs()
  const [couponError, setCouponError] = useState('')
  const toast = useToast()
  const quote = useQuote(prefs)

  // Drop a coupon that the server no longer accepts (e.g. cart dropped below the minimum).
  useEffect(() => {
    if (prefs.coupon_code && quote.data && !quote.data.coupon?.valid) {
      setCouponError(quote.data.coupon?.message || '')
    }
  }, [quote.data, prefs.coupon_code])

  const applyCoupon = async (code) => {
    setCouponError('')
    try {
      const res = await cartService.applyCoupon({ code, state: prefs.state, delivery_method: prefs.delivery_method })
      setPrefs({ coupon_code: code })
      toast.success(res.detail)
    } catch (err) {
      setCouponError(errorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-48" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </div>
    )
  }
  if (isError) return <ErrorState title="Unable to load your cart" onRetry={refresh} className="py-28" />

  if (!items.length) {
    return (
      <>
        <Seo title="Your cart" noindex />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven’t added anything yet. Explore phones, laptops and accessories at great prices."
          action={{ label: 'Start shopping', to: '/shop' }}
          secondary={{ label: 'Browse categories', to: '/categories' }}
          className="py-28"
        />
      </>
    )
  }

  return (
    <>
      <Seo title="Your cart" noindex />
      <div className="container py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <div className="mt-4 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Your cart <span className="text-metal-300">({itemCount})</span>
          </h1>
          <button
            type="button"
            onClick={() => clearCart().then(() => toast.info('Your cart has been cleared.'))}
            className="flex items-center gap-1.5 text-sm font-medium text-metal-500 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" /> Clear cart
          </button>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            {hasIssues && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" /> Some items need attention — adjust quantities or remove unavailable items before checkout.
              </div>
            )}
            <div className="card px-4 sm:px-6">
              <ul className="divide-y divide-metal-100">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartLine key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <Button to="/shop" variant="ghost" icon={ArrowLeft} className="mt-4">
              Continue shopping
            </Button>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Estimate delivery</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-metal-50 p-1 text-sm font-semibold">
                {[
                  ['delivery', 'Delivery'],
                  ['pickup', 'Store pickup'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPrefs({ delivery_method: value })}
                    className={`rounded-lg py-2 transition ${prefs.delivery_method === value ? 'bg-white shadow-sm' : 'text-metal-500'}`}
                    aria-pressed={prefs.delivery_method === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {prefs.delivery_method === 'delivery' && (
                <div className="mt-4">
                  <label htmlFor="ship-state" className="label">
                    State
                  </label>
                  <select id="ship-state" className="input" value={prefs.state} onChange={(e) => setPrefs({ state: e.target.value })}>
                    <option value="">Select your state</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <OrderSummary
              quote={quote.data}
              loading={quote.isFetching}
              couponCode={prefs.coupon_code}
              couponError={couponError}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={() => {
                setPrefs({ coupon_code: '' })
                setCouponError('')
              }}
            >
              <Button to="/checkout" size="lg" className="mt-6 w-full" iconRight={ArrowRight} disabled={hasIssues} onClick={(e) => hasIssues && e.preventDefault()}>
                Proceed to checkout
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-metal-400">
                <Lock className="h-3.5 w-3.5" /> Secure checkout · prices confirmed by our server
              </p>
            </OrderSummary>
          </div>
        </div>
      </div>
    </>
  )
}
