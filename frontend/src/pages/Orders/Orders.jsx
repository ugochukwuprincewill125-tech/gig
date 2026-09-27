import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronRight, Package } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import EmptyState, { ErrorState } from '../../components/EmptyState/EmptyState'
import { Skeleton } from '../../components/Loader/Skeleton'
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/OrderStatusBadge/OrderStatusBadge'
import Pagination from '../../components/Pagination/Pagination'
import { orderService } from '../../services/orderService'
import { cn, formatDate, formatNaira } from '../../utils/format'

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'placed', label: 'Awaiting payment' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function Orders() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', status, page],
    queryFn: () => orderService.list({ status: status || undefined, page, page_size: 10 }),
    placeholderData: keepPreviousData,
  })

  return (
    <div>
      <h2 className="text-2xl font-bold">My orders</h2>
      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => (setStatus(f.value), setPage(1))}
            className={cn('flex-none rounded-full px-4 py-2 text-sm font-semibold transition', status === f.value ? 'bg-ink-900 text-white' : 'bg-metal-50 text-metal-600 hover:bg-metal-100')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState title="Unable to load orders" onRetry={refetch} />
        ) : !data.results.length ? (
          <EmptyState icon={Package} title={status ? 'No orders with this status' : 'No orders yet'} message="Your orders will show up here once you check out." action={{ label: 'Start shopping', to: '/shop' }} />
        ) : (
          <>
            {/* Mobile cards / desktop table-like rows */}
            <div className="hidden overflow-hidden rounded-2xl border border-metal-100 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-metal-50 text-xs uppercase tracking-wider text-metal-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 font-semibold">Delivery status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-metal-100">
                  {data.results.map((o) => (
                    <tr key={o.id} className="transition hover:bg-metal-50/60">
                      <td className="px-5 py-4 font-semibold">{o.order_number}</td>
                      <td className="px-5 py-4 text-metal-500">{formatDate(o.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {o.items.slice(0, 3).map((it) => (
                              <span key={it.id} className="h-9 w-9 overflow-hidden rounded-lg border-2 border-white bg-metal-50">
                                {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                              </span>
                            ))}
                          </div>
                          <span className="text-metal-500">{o.item_count}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold">{formatNaira(o.total)}</td>
                      <td className="px-5 py-4">
                        <PaymentStatusBadge status={o.payment_status} label={o.payment_status_display} />
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={o.status} label={o.status_display} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to={`/account/orders/${o.order_number}`} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                          View <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-3 md:hidden">
              {data.results.map((o) => (
                <li key={o.id}>
                  <Link to={`/account/orders/${o.order_number}`} className="card block p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{o.order_number}</p>
                      <ChevronRight className="h-4 w-4 text-metal-400" />
                    </div>
                    <p className="mt-1 text-xs text-metal-500">
                      {formatDate(o.created_at)} · {o.item_count} item{o.item_count === 1 ? '' : 's'} · <strong className="text-ink-900">{formatNaira(o.total)}</strong>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <OrderStatusBadge status={o.status} label={o.status_display} />
                      <PaymentStatusBadge status={o.payment_status} label={o.payment_status_display} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination page={data.current_page} totalPages={data.total_pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
