import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, Tag, X } from 'lucide-react'
import { useState } from 'react'

import { cn, formatNaira } from '../../utils/format'

function Row({ label, value, tone, strong }) {
  return (
    <div className={cn('flex items-center justify-between', strong ? 'text-base' : 'text-sm')}>
      <span className={strong ? 'font-semibold text-ink-900' : 'text-metal-500'}>{label}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className={cn(strong ? 'text-xl font-bold' : 'font-semibold', tone === 'success' && 'text-success')}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/** Totals panel — every number here comes from the backend quote. */
export default function OrderSummary({ quote, loading, couponCode, onApplyCoupon, onRemoveCoupon, couponError, children, showCoupon = true }) {
  const [code, setCode] = useState(couponCode || '')
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <div className="mt-5 space-y-3">
        <Row label="Subtotal" value={formatNaira(quote?.subtotal || 0)} />
        {Number(quote?.discount) > 0 && <Row label={`Discount${quote.coupon?.code ? ` (${quote.coupon.code})` : ''}`} value={`−${formatNaira(quote.discount)}`} tone="success" />}
        <Row
          label={quote?.delivery_method === 'pickup' ? 'Store pickup' : 'Delivery'}
          value={!quote?.shipping_estimated ? 'Select state' : Number(quote.shipping_fee) === 0 ? 'Free' : formatNaira(quote.shipping_fee)}
        />
        <div className="h-px bg-metal-100" />
        <Row label="Total" value={formatNaira(quote?.total || 0)} strong />
        {loading && (
          <p className="flex items-center gap-2 text-xs text-metal-400">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Updating totals…
          </p>
        )}
      </div>

      {showCoupon && (
        <div className="mt-6 border-t border-metal-100 pt-5">
          {quote?.coupon?.valid ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">
              <span className="flex items-center gap-2 font-semibold">
                <Tag className="h-4 w-4" /> {quote.coupon.code} applied
              </span>
              <button type="button" onClick={() => (setCode(''), onRemoveCoupon())} className="rounded-lg p-1 hover:bg-emerald-100" aria-label="Remove coupon">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (code.trim()) onApplyCoupon(code.trim().toUpperCase())
              }}
            >
              <label htmlFor="coupon" className="label">
                Coupon code
              </label>
              <div className="flex gap-2">
                <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} className={cn('input uppercase', couponError && 'input-error')} placeholder="Enter code" autoComplete="off" />
                <button type="submit" className="btn-outline px-4">
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="mt-1.5 text-xs font-medium text-danger" role="alert">
                  {couponError}
                </p>
              )}
            </form>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
