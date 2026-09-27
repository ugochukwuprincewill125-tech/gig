import { useQuery } from '@tanstack/react-query'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, LayoutGrid, MapPin, ShieldCheck, Truck } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import { productService } from '../../services/productService'
import { formatNaira } from '../../utils/format'

const float = (delay, distance = 14, duration = 6) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
})

function FloatingCard({ product, className, delay, size = 'md' }) {
  const reduce = useReducedMotion()
  if (!product) return null
  const dims = size === 'lg' ? 'w-56 sm:w-64' : 'w-40 sm:w-48'
  return (
    <div className={`absolute ${className}`}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div {...(reduce ? {} : float(delay))}>
        <Link
          to={`/products/${product.slug}`}
          className={`block ${dims} rounded-3xl border border-white/10 bg-white/[0.06] p-2.5 shadow-2xl backdrop-blur-xl transition hover:border-white/25`}
        >
          <div className="aspect-square overflow-hidden rounded-2xl bg-metal-100">
            {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" />}
          </div>
          <div className="px-1.5 pb-1 pt-3">
            <p className="line-clamp-1 text-xs font-medium text-metal-300">{product.brand?.name}</p>
            <p className="line-clamp-1 text-sm font-semibold text-white">{product.name}</p>
            <p className="mt-1 text-sm font-bold text-brand-300">{formatNaira(product.current_price)}</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const { data } = useQuery({
    queryKey: ['products', 'hero'],
    queryFn: () => productService.list({ featured: true, page_size: 6, ordering: '-effective_price' }),
    staleTime: 300_000,
  })
  const picks = data?.results || []

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-grid-fade [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div
        className="absolute -left-40 top-10 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-500/25 blur-[120px]"
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-400/10 blur-[120px]"
        animate={reduce ? undefined : { x: [0, -40, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 md:min-h-[640px] lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-metal-200 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_12px_2px] shadow-brand-400/60" />
            Timeline Global Systems — Home of Quality Gadgets
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-balance text-[2.6rem] font-bold leading-[1.05] sm:text-6xl lg:text-[4.25rem]"
          >
            Technology That{' '}
            <span className="bg-gradient-to-r from-white via-brand-200 to-brand-400 bg-clip-text text-transparent">Fits Your World.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-metal-300 sm:text-lg"
          >
            Discover quality gadgets, accessories and technology solutions at competitive prices — from our stores in Computer Village, Ikeja to your doorstep anywhere in Nigeria.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button to="/shop" variant="accent" size="lg" iconRight={ArrowRight} className="shadow-glow">
              Shop Now
            </Button>
            <Button to="/categories" variant="glass" size="lg" icon={LayoutGrid}>
              Explore Categories
            </Button>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-metal-300 sm:text-sm"
          >
            <li className="flex flex-col gap-1.5">
              <MapPin className="h-4 w-4 text-brand-400" /> 2 stores in Computer Village
            </li>
            <li className="flex flex-col gap-1.5">
              <Truck className="h-4 w-4 text-brand-400" /> Nationwide delivery
            </li>
            <li className="flex flex-col gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-400" /> Secure checkout
            </li>
          </motion.ul>
        </div>

        {/* Floating gadget showcase */}
        <motion.div style={reduce ? undefined : { y }} className="relative mx-auto hidden h-[520px] w-full max-w-[560px] sm:block">
          <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]" />
          <FloatingCard product={picks[0]} size="lg" delay={0} className="left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2" />
          <FloatingCard product={picks[1]} delay={0.6} className="left-0 top-4 z-10 -rotate-6" />
          <FloatingCard product={picks[2]} delay={1.2} className="bottom-2 right-0 z-10 rotate-6" />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute right-6 top-10 z-30 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs backdrop-blur-xl"
          >
            <p className="font-semibold text-white">Pickup available</p>
            <p className="text-metal-300">Oremeji & Otigba St.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
