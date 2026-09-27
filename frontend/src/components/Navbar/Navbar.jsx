import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, Package, Search, ShoppingBag, Truck, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import useScrolled from '../../hooks/useScrolled'
import { catalogService } from '../../services/productService'
import { categoryIcon } from '../../utils/icons'
import { cn } from '../../utils/format'
import Logo from '../Logo/Logo'
import SearchBar from '../SearchBar/SearchBar'
import MobileMenu from './MobileMenu'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories', mega: true },
  { to: '/brands', label: 'Brands' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

function CountBadge({ count, bumpKey }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={bumpKey}
          initial={{ scale: 0.4 }}
          animate={{ scale: [1.4, 1] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function MegaMenu({ open, onClose }) {
  const { data: categories = [] } = useQuery({ queryKey: ['categories', 'root'], queryFn: () => catalogService.categories({ root: true }), staleTime: 600_000 })
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          className="absolute left-1/2 top-full z-50 w-[min(92vw,960px)] -translate-x-1/2 pt-3"
        >
          <div className="grid grid-cols-3 gap-1 rounded-3xl border border-metal-100 bg-white p-4 shadow-lift lg:grid-cols-4">
            {categories.map((c) => {
              const Icon = categoryIcon(c.icon)
              return (
                <Link key={c.slug} to={`/category/${c.slug}`} onClick={onClose} className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-metal-50">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-metal-50 transition group-hover:bg-ink-900 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-900">{c.name}</span>
                    <span className="block truncate text-xs text-metal-400">
                      {c.children?.length ? c.children.map((ch) => ch.name).join(', ') : `${c.product_count} products`}
                    </span>
                  </span>
                </Link>
              )
            })}
            <Link to="/categories" onClick={onClose} className="col-span-full mt-1 rounded-2xl bg-ink-900 p-3 text-center text-sm font-semibold text-white hover:bg-ink-700">
              Browse all categories →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AccountMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  if (!user) {
    return (
      <Link to="/login" className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-metal-100" aria-label="Sign in">
        <User className="h-5 w-5" />
      </Link>
    )
  }

  const items = [
    { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/account/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-11 items-center gap-2 rounded-full pl-1 pr-2 transition hover:bg-metal-100"
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-ink-900 text-xs font-bold text-white">
          {user.profile_image ? <img src={user.profile_image} alt="" className="h-full w-full object-cover" /> : `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
        </span>
        <ChevronDown className={cn('hidden h-4 w-4 transition-transform lg:block', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-2xl border border-metal-100 bg-white p-2 shadow-lift"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-semibold">{user.full_name}</p>
              <p className="truncate text-xs text-metal-400">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-metal-100" />
            {items.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-metal-50">
                <Icon className="h-4 w-4 text-metal-500" /> {label}
              </Link>
            ))}
            <div className="my-1 h-px bg-metal-100" />
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false)
                await logout()
                navigate('/')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ onOpenSearch }) {
  const scrolled = useScrolled(40)
  const { itemCount, openDrawer, bump } = useCart()
  const { count: wishCount } = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const { pathname } = useLocation()
  const megaTimer = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname])

  const openMega = () => {
    clearTimeout(megaTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }

  return (
    <>
      <div className="hidden bg-ink-900 text-metal-200 md:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-brand-400" aria-hidden /> Nationwide delivery · Store pickup at Computer Village, Ikeja
          </p>
          <div className="flex items-center gap-5">
            <Link to="/track-order" className="hover:text-white">
              Track order
            </Link>
            <a href="mailto:timelinegadget@gmail.com" className="hover:text-white">
              timelinegadget@gmail.com
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled ? 'border-metal-100 bg-white/85 shadow-[0_8px_30px_-12px_rgba(10,15,28,.15)] backdrop-blur-xl' : 'border-transparent bg-white',
        )}
      >
        <div className={cn('container flex items-center gap-3 transition-all duration-300 lg:gap-6', scrolled ? 'h-16' : 'h-[72px] md:h-20')}>
          <button type="button" onClick={() => setMobileOpen(true)} className="-ml-2 rounded-full p-2 hover:bg-metal-100 lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>

          <Logo />

          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((link) =>
              link.mega ? (
                <div key={link.to} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <NavLink
                    to={link.to}
                    onFocus={openMega}
                    className={({ isActive }) => cn('flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors', isActive ? 'text-ink-900' : 'text-metal-500 hover:text-ink-900')}
                  >
                    {link.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', megaOpen && 'rotate-180')} />
                  </NavLink>
                  <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => cn('relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors', isActive ? 'text-ink-900' : 'text-metal-500 hover:text-ink-900')}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />}
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <SearchBar className="mr-2 hidden w-[240px] xl:block 2xl:w-[300px]" />
            <button type="button" onClick={onOpenSearch} className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-metal-100 xl:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/account/wishlist" className="relative hidden h-11 w-11 items-center justify-center rounded-full transition hover:bg-metal-100 sm:flex" aria-label={`Wishlist (${wishCount})`}>
              <Heart className="h-5 w-5" />
              <CountBadge count={wishCount} bumpKey={wishCount} />
            </Link>
            <div className="hidden sm:block">
              <AccountMenu />
            </div>
            <button type="button" onClick={openDrawer} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-brand-500" aria-label={`Cart (${itemCount} items)`}>
              <motion.span key={bump} animate={bump ? { rotate: [0, -14, 12, -6, 0] } : undefined} transition={{ duration: 0.5 }}>
                <ShoppingBag className="h-5 w-5" />
              </motion.span>
              <CountBadge count={itemCount} bumpKey={`${itemCount}-${bump}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={LINKS} />
    </>
  )
}

export function SearchOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75]">
          <motion.div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="relative bg-white px-4 pb-6 pt-4 shadow-lift sm:px-6"
            role="dialog"
            aria-label="Search"
          >
            <div className="container flex items-start gap-3 px-0">
              <SearchBar autoFocus className="flex-1" onNavigate={onClose} />
              <button type="button" onClick={onClose} className="mt-1 rounded-full p-2.5 hover:bg-metal-100" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="container mt-4 flex flex-wrap gap-2 px-0 text-xs">
              {['iPhone', 'Samsung', 'Laptop', 'Power bank', 'Earbuds', 'Router'].map((t) => (
                <Link key={t} to={`/shop?q=${encodeURIComponent(t)}`} onClick={onClose} className="rounded-full bg-metal-50 px-3 py-1.5 font-medium text-metal-600 hover:bg-metal-100">
                  {t}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
