import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, BatteryCharging, Headphones, Laptop, MapPin, Package, ShieldCheck, Store, Truck, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import { ErrorState } from '../../components/EmptyState/EmptyState'
import InstagramIcon from '../../components/Icons/InstagramIcon'
import { ProductGridSkeleton, Skeleton } from '../../components/Loader/Skeleton'
import Reveal from '../../components/Motion/Reveal'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import QuickViewModal from '../../components/QuickView/QuickViewModal'
import SectionHeading from '../../components/Section/SectionHeading'
import Seo from '../../components/Seo/Seo'
import useStoreInfo from '../../hooks/useStoreInfo'
import { catalogService, productService } from '../../services/productService'
import { cn } from '../../utils/format'
import Hero from './Hero'

const TABS = [
  { key: 'featured', label: 'Featured', params: { featured: true } },
  { key: 'bestseller', label: 'Best Sellers', params: { bestseller: true } },
  { key: 'new_arrival', label: 'New Arrivals', params: { new_arrival: true } },
]

function CategoryShowcase() {
  const { data, isLoading } = useQuery({ queryKey: ['categories', 'featured'], queryFn: () => catalogService.categories({ featured: true }) })
  const cats = (data || []).slice(0, 9)
  return (
    <section className="container py-16 sm:py-24">
      <SectionHeading eyebrow="Shop by category" title="Find exactly what you need" subtitle="From flagship phones to the right cable — browse our most popular departments." link={{ to: '/categories', label: 'All categories' }} />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl sm:h-52" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {cats.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.04} className={cn(i === 0 && 'lg:col-span-2 lg:row-span-2', i === 8 && 'hidden lg:block')}>
              <CategoryCard category={c} className="h-full min-h-[11rem] [&>a]:h-full" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}

function ProductTabs() {
  const [tab, setTab] = useState(TABS[0])
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', 'home-tab', tab.key],
    queryFn: () => productService.list({ ...tab.params, page_size: 8 }),
  })
  return (
    <section className="bg-metal-50/70 py-16 sm:py-24">
      <div className="container">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow mb-3">Our picks</p>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-[2.1rem]">Gadgets people love</h2>
          </Reveal>
          <div className="flex gap-1 self-start rounded-full bg-white p-1 shadow-card" role="tablist" aria-label="Product collections">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab.key === t.key}
                onClick={() => setTab(t)}
                className={cn('relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5', tab.key === t.key ? 'text-white' : 'text-metal-500 hover:text-ink-900')}
              >
                {tab.key === t.key && <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-ink-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ErrorState title="Unable to load products" onRetry={refetch} />
        ) : (
          <ProductGrid key={tab.key} products={data.results} />
        )}
        <div className="mt-10 text-center">
          <Button to="/shop" variant="outline" iconRight={ArrowRight}>
            View all products
          </Button>
        </div>
      </div>
    </section>
  )
}

function PromoBanners() {
  return (
    <section className="container grid gap-4 py-16 sm:py-24 md:grid-cols-2 md:gap-6">
      <Reveal>
        <Link to="/category/laptops" className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 p-7 text-white sm:h-80 sm:p-9">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 bg-grid-fade [background-size:32px_32px] opacity-60" />
          <Laptop className="absolute -right-6 top-6 h-56 w-56 text-white/[0.06] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105" strokeWidth={1} aria-hidden />
          <p className="eyebrow relative text-brand-300">Work · Study · Create</p>
          <h3 className="relative mt-3 max-w-xs text-2xl font-bold sm:text-3xl">Laptops that keep up with you</h3>
          <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Shop laptops <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
      <Reveal delay={0.08}>
        <Link to="/category/phone-accessories" className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 p-7 text-white sm:h-80 sm:p-9">
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <BatteryCharging className="absolute -right-4 top-6 h-56 w-56 text-white/10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105" strokeWidth={1} aria-hidden />
          <p className="eyebrow relative text-brand-100">Power & charging</p>
          <h3 className="relative mt-3 max-w-xs text-2xl font-bold sm:text-3xl">Never run out of battery again</h3>
          <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Shop accessories <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </section>
  )
}

function Deals() {
  const [quickView, setQuickView] = useState(null)
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: () => productService.list({ on_sale: true, in_stock: true, min_discount: 8, page_size: 10, ordering: '-review_count' }),
  })
  if (!isLoading && !data?.results?.length) return null
  return (
    <section className="py-4">
      <div className="container">
        <SectionHeading eyebrow="Deals" title="Great prices right now" subtitle="Discounted gadgets while stocks last." link={{ to: '/shop?on_sale=true', label: 'All deals' }} />
      </div>
      <div className="container">
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[360px] w-[220px] flex-none rounded-2xl" />)
            : data.results.map((p) => (
                <div key={p.id} className="w-[200px] flex-none snap-start sm:w-[240px]">
                  <ProductCard product={p} onQuickView={setQuickView} />
                </div>
              ))}
        </div>
      </div>
      <QuickViewModal slug={quickView?.slug} preview={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}

function BrandMarquee() {
  const { data = [] } = useQuery({ queryKey: ['brands'], queryFn: () => catalogService.brands() })
  if (!data.length) return null
  const row = [...data, ...data]
  return (
    <section className="border-y border-metal-100 py-10" aria-label="Brands we stock">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-metal-400">Brands available at Timeline</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div className="flex w-max gap-12 pr-12" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          {row.map((b, i) => (
            <Link key={`${b.slug}-${i}`} to={`/brands/${b.slug}`} className="font-display text-xl font-bold text-metal-300 transition-colors hover:text-ink-900 sm:text-2xl">
              {b.name}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const VALUES = [
  { icon: Package, title: 'Quality gadgets', text: 'Phones, computers and electronics carefully selected for performance and reliability.' },
  { icon: Headphones, title: 'Technology accessories', text: 'Chargers, cables, audio, storage and networking — the essentials in one place.' },
  { icon: Wallet, title: 'Competitive pricing', text: 'Fair Computer Village prices, with transparent totals calculated before you pay.' },
  { icon: Truck, title: 'Nationwide delivery', text: 'Fast delivery in Lagos and reliable shipping to every state in Nigeria.' },
  { icon: Store, title: 'Physical locations', text: 'Visit our main office and branch in Computer Village, Ikeja to see products in person.' },
  { icon: ShieldCheck, title: 'Customer service', text: 'Friendly guidance before and after purchase from a team that knows its gadgets.' },
]

function WhyTimeline() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-grid-fade [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="container relative">
        <SectionHeading dark eyebrow="Why Timeline" title="A gadget store built on trust" subtitle="Timeline Global Systems Limited serves individuals, students and businesses from Computer Village — Lagos’ technology hub." align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.06]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/20 transition-transform group-hover:-rotate-6">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metal-400">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisitUs() {
  const { company } = useStoreInfo()
  return (
    <section className="container py-16 sm:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="flex flex-col justify-center">
          <p className="eyebrow mb-3">Visit us</p>
          <h2 className="text-2xl font-bold sm:text-3xl">Two stores in Computer Village, Ikeja</h2>
          <p className="mt-4 text-metal-500">See gadgets in person, get expert advice or pick up your online order from either location.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/contact#locations" icon={MapPin}>
              Get directions
            </Button>
            <Button href={company.instagram} target="_blank" rel="noopener noreferrer" variant="outline" icon={InstagramIcon}>
              {company.instagram_handle}
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {company.locations.map((loc, i) => (
            <Reveal key={loc.id} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-metal-100 bg-white p-7 shadow-card">
                <span className="chip bg-metal-50 text-ink-900">{loc.label}</span>
                <address className="mt-4 text-[15px] not-italic leading-7 text-ink-800">
                  {loc.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.map_query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Open in Google Maps <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <BrandMarquee />
      <CategoryShowcase />
      <ProductTabs />
      <PromoBanners />
      <Deals />
      <div className="h-16 sm:h-24" />
      <WhyTimeline />
      <VisitUs />
      <section className="container">
        <Reveal className="flex flex-col items-center gap-5 rounded-3xl bg-metal-50 px-6 py-12 text-center sm:py-14">
          <InstagramIcon className="h-8 w-8 text-brand-500" />
          <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">Stay in the loop</h2>
          <p className="max-w-lg text-metal-500">Follow Timeline Gadgets on Instagram for new arrivals, restocks and in-store offers.</p>
          <Button href="https://www.instagram.com/timelinegadgets/" target="_blank" rel="noopener noreferrer" icon={InstagramIcon}>
            Follow @timelinegadgets
          </Button>
        </Reveal>
      </section>
    </>
  )
}
