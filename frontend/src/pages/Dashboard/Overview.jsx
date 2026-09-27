import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, MailWarning, MapPin, Package, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import EmptyState, { ErrorState } from '../../components/EmptyState/EmptyState'
import { Skeleton } from '../../components/Loader/Skeleton'
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/OrderStatusBadge/OrderStatusBadge'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { errorMessage } from '../../services/api'
import { authService, userService } from '../../services/authService'
import { formatDate, formatNaira } from '../../utils/format'

function Stat({ icon: Icon, label, value, to, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to={to} className="group flex h-full items-center gap-4 rounded-2xl border border-metal-100 bg-white p-5 shadow-card transition hover:shadow-lift">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-metal-50 transition group-hover:bg-ink-900 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-2xl font-bold">{value}</span>
          <span className="text-sm text-metal-500">{label}</span>
        </span>
      </Link>
    </motion.div>
  )
}

export default function Overview() {
  const { user } = useAuth()
  const toast = useToast()
  const [sending, setSending] = useState(false)
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: userService.dashboard })

  const resend = async () => {
    setSending(true)
    try {
      toast.success((await authService.resendVerification()).detail)
    } catch (err) {
      toast.error('Couldn’t send email', errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-8">
      {!user.email_verified && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <MailWarning className="h-4 w-4 flex-none" /> Please verify your email address ({user.email}).
          </p>
          <Button size="sm" variant="outline" onClick={resend} loading={sending}>
            Resend link
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <Stat icon={Package} label="Total orders" value={data.total_orders} to="/account/orders" delay={0} />
            <Stat icon={Truck} label="In progress" value={data.pending_orders} to="/account/orders" delay={0.05} />
            <Stat icon={Heart} label="Wishlist items" value={data.wishlist_count} to="/account/wishlist" delay={0.1} />
          </>
        )}
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link to="/account/orders" className="flex items-center gap-1 text-sm font-semibold text-ink-900 hover:text-brand-600">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="mt-5 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data.recent_orders.length ? (
          <EmptyState icon={Package} title="No orders yet" message="When you place an order it will appear here." action={{ label: 'Start shopping', to: '/shop' }} className="py-10" />
        ) : (
          <ul className="mt-4 divide-y divide-metal-100">
            {data.recent_orders.map((o) => (
              <li key={o.id}>
                <Link to={`/account/orders/${o.order_number}`} className="flex flex-wrap items-center gap-3 py-4 hover:opacity-80">
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 3).map((it) => (
                      <span key={it.id} className="h-11 w-11 overflow-hidden rounded-xl border-2 border-white bg-metal-50">
                        {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                      </span>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{o.order_number}</p>
                    <p className="text-xs text-metal-500">
                      {formatDate(o.created_at)} · {o.item_count} item{o.item_count === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={o.status} label={o.status_display} />
                    <PaymentStatusBadge status={o.payment_status} label={o.payment_status_display} />
                  </div>
                  <p className="w-full text-sm font-bold sm:w-auto">{formatNaira(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/account/addresses" className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
          <MapPin className="h-5 w-5 text-brand-500" />
          <span className="flex-1">
            <span className="block font-semibold">Saved addresses</span>
            <span className="text-sm text-metal-500">{data?.address_count ?? '–'} saved</span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/track-order" className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
          <Truck className="h-5 w-5 text-brand-500" />
          <span className="flex-1">
            <span className="block font-semibold">Track an order</span>
            <span className="text-sm text-metal-500">Use your order number and email</span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
