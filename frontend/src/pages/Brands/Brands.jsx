import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'

import BrandCard from '../../components/BrandCard/BrandCard'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs'
import EmptyState, { ErrorState } from '../../components/EmptyState/EmptyState'
import { Skeleton } from '../../components/Loader/Skeleton'
import Reveal from '../../components/Motion/Reveal'
import Seo from '../../components/Seo/Seo'
import { catalogService } from '../../services/productService'

export default function Brands() {
  const [filter, setFilter] = useState('')
  const { data = [], isLoading, isError, refetch } = useQuery({ queryKey: ['brands'], queryFn: () => catalogService.brands() })
  const list = data.filter((b) => b.name.toLowerCase().includes(filter.toLowerCase()))
  const featured = list.filter((b) => b.is_featured)
  const others = list.filter((b) => !b.is_featured)

  return (
    <>
      <Seo title="Brands" description="Shop gadgets by brand at Timeline Gadgets — phones, laptops, audio, storage and accessories from the brands we stock." />
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-grid-fade [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="container relative py-14 sm:py-20">
          <Breadcrumbs items={[{ label: 'Brands' }]} dark />
          <h1 className="mt-5 text-3xl font-bold sm:text-5xl">Shop by brand</h1>
          <p className="mt-3 max-w-xl text-metal-300">Brands currently available in the Timeline store. Tap a brand to see what’s in stock.</p>
          <div className="relative mt-8 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-metal-300" />
            <label htmlFor="brand-filter" className="sr-only">
              Filter brands
            </label>
            <input
              id="brand-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Find a brand…"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 text-sm text-white placeholder:text-metal-300 focus:border-white/30 focus:ring-white/10"
            />
          </div>
        </div>
      </section>

      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState title="Unable to load brands" onRetry={refetch} />
        ) : !list.length ? (
          <EmptyState icon={Search} title="No brands found" message={`Nothing matches “${filter}”.`} action={{ label: 'Clear search', onClick: () => setFilter('') }} />
        ) : (
          <>
            {featured.length > 0 && (
              <>
                <h2 className="text-lg font-bold">Popular brands</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {featured.map((b, i) => (
                    <Reveal key={b.slug} delay={(i % 8) * 0.03}>
                      <BrandCard brand={b} />
                    </Reveal>
                  ))}
                </div>
              </>
            )}
            {others.length > 0 && (
              <>
                <h2 className="mt-12 text-lg font-bold">More brands</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {others.map((b, i) => (
                    <Reveal key={b.slug} delay={(i % 8) * 0.03}>
                      <BrandCard brand={b} />
                    </Reveal>
                  ))}
                </div>
              </>
            )}
            <p className="mt-12 text-center text-xs text-metal-400">
              Brand names are trademarks of their respective owners and are used only to identify the products we sell.
            </p>
          </>
        )}
      </div>
    </>
  )
}
