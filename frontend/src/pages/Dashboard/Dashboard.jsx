import { AnimatePresence, motion } from 'framer-motion'
import { Heart, LayoutDashboard, LogOut, MapPin, Package, User } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import Seo from '../../components/Seo/Seo'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/format'

const NAV = [
  { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <Seo title="My account" noindex />
      <section className="border-b border-metal-100 bg-metal-50/60">
        <div className="container flex items-center gap-4 py-8 sm:py-10">
          <span className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-2xl bg-ink-900 text-lg font-bold text-white">
            {user.profile_image ? <img src={user.profile_image} alt="" className="h-full w-full object-cover" /> : `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-metal-500">Welcome back,</p>
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{user.full_name}</h1>
          </div>
        </div>
      </section>

      <div className="container grid gap-8 py-8 lg:grid-cols-[240px_1fr] lg:py-12">
        <aside>
          <nav className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" aria-label="Account">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-none items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-ink-900 text-white' : 'bg-metal-50 text-ink-800 hover:bg-metal-100 lg:bg-transparent',
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={async () => {
                await logout()
                navigate('/')
              }}
              className="flex flex-none items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-danger hover:bg-red-50 lg:mt-4"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
