import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LoaderCircle, Search, SearchX, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useDebounce from '../../hooks/useDebounce'
import { productService } from '../../services/productService'
import { categoryIcon } from '../../utils/icons'
import { cn, formatNaira } from '../../utils/format'

/**
 * Debounced search with live suggestions (products, categories, brands).
 * Enter submits to the shop page; arrow keys move through product suggestions.
 */
export default function SearchBar({ className, autoFocus = false, onNavigate, dark = false }) {
  const navigate = useNavigate()
  const listId = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const wrapper = useRef(null)
  const term = useDebounce(q.trim(), 280)

  const { data, isFetching } = useQuery({
    queryKey: ['suggestions', term],
    queryFn: ({ signal }) => productService.suggestions(term, signal),
    enabled: term.length >= 2,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })

  useEffect(() => {
    const onClick = (e) => wrapper.current && !wrapper.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => setCursor(-1), [term])

  const go = (to) => {
    setOpen(false)
    setQ('')
    onNavigate?.()
    navigate(to)
  }

  const submit = (e) => {
    e.preventDefault()
    const products = data?.products || []
    if (cursor >= 0 && products[cursor]) return go(`/products/${products[cursor].slug}`)
    if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`)
    return undefined
  }

  const onKeyDown = (e) => {
    const n = data?.products?.length || 0
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(n - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(-1, c - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showPanel = open && term.length >= 2 && data

  return (
    <div ref={wrapper} className={cn('relative', className)}>
      <form onSubmit={submit} role="search">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <div className="relative">
          <Search className={cn('pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2', dark ? 'text-metal-300' : 'text-metal-400')} />
          <input
            id={`${listId}-input`}
            type="search"
            autoComplete="off"
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search phones, laptops, SKU, brands…"
            role="combobox"
            aria-expanded={Boolean(showPanel)}
            aria-controls={listId}
            aria-autocomplete="list"
            className={cn(
              'h-12 w-full rounded-2xl border pl-11 pr-11 text-sm transition focus:ring-2',
              dark
                ? 'border-white/10 bg-white/10 text-white placeholder:text-metal-300 focus:border-white/30 focus:ring-white/10'
                : 'border-metal-200 bg-metal-50 text-ink-900 placeholder:text-metal-400 focus:border-brand-500 focus:bg-white focus:ring-brand-500/15',
            )}
          />
          {isFetching ? (
            <LoaderCircle className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-metal-400" />
          ) : (
            q && (
              <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-metal-400 hover:text-ink-900" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </form>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-full xl:min-w-[440px] overflow-hidden rounded-2xl border border-metal-100 bg-white text-ink-900 shadow-lift"
          >
            {data.total === 0 ? (
              <div className="flex items-center gap-3 p-5 text-sm text-metal-500">
                <SearchX className="h-5 w-5" /> No products match “{term}”. Try a brand or category name.
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {(data.categories.length > 0 || data.brands.length > 0) && (
                  <div className="flex flex-wrap gap-2 border-b border-metal-100 p-3">
                    {data.categories.map((c) => {
                      const Icon = categoryIcon(c.icon)
                      return (
                        <button key={c.slug} type="button" onClick={() => go(`/category/${c.slug}`)} className="inline-flex items-center gap-1.5 rounded-full bg-metal-50 px-3 py-1.5 text-xs font-medium hover:bg-metal-100">
                          <Icon className="h-3.5 w-3.5" /> {c.name}
                        </button>
                      )
                    })}
                    {data.brands.map((b) => (
                      <button key={b.slug} type="button" onClick={() => go(`/brands/${b.slug}`)} className="inline-flex items-center rounded-full border border-metal-200 px-3 py-1.5 text-xs font-medium hover:border-ink-900">
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}
                <ul className="p-2">
                  {data.products.map((p, i) => (
                    <li key={p.id} role="option" aria-selected={cursor === i}>
                      <Link
                        to={`/products/${p.slug}`}
                        onClick={() => go(`/products/${p.slug}`)}
                        onMouseEnter={() => setCursor(i)}
                        className={cn('flex items-center gap-3 rounded-xl p-2', cursor === i && 'bg-metal-50')}
                      >
                        <span className="h-12 w-12 flex-none overflow-hidden rounded-lg bg-metal-50">
                          {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 text-sm font-medium">{p.name}</span>
                          <span className="text-xs text-metal-400">
                            {p.brand ? `${p.brand} · ` : ''}
                            {p.category}
                          </span>
                        </span>
                        <span className="text-sm font-semibold">{formatNaira(p.current_price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => go(`/shop?q=${encodeURIComponent(term)}`)}
                  className="flex w-full items-center justify-between border-t border-metal-100 px-4 py-3 text-sm font-semibold hover:bg-metal-50"
                >
                  See all {data.total} results for “{term}” <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
