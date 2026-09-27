import { Heart, House, LayoutGrid, Search, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { cn } from '../../utils/format'

/** App-style bottom navigation for phones. */
export default function MobileBottomNav({ onOpenSearch }) {
  const { user } = useAuth()
  const { count } = useWishlist()
  const item = ({ isActive }) =>
    cn('flex flex-1 flex-col items-center gap-1 pb-1.5 pt-2 text-[10px] font-semibold transition-colors', isActive ? 'text-ink-900' : 'text-metal-400')

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-metal-100 bg-white/95 pb-safe backdrop-blur-xl sm:hidden" aria-label="Quick navigation">
      <div className="flex">
        <NavLink to="/" end className={item}>
          <House className="h-5 w-5" /> Home
        </NavLink>
        <NavLink to="/shop" className={item}>
          <LayoutGrid className="h-5 w-5" /> Shop
        </NavLink>
        <button type="button" onClick={onOpenSearch} className={item({ isActive: false })}>
          <Search className="h-5 w-5" /> Search
        </button>
        <NavLink to="/account/wishlist" className={item}>
          <span className="relative">
            <Heart className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-brand-500" />}
          </span>
          Wishlist
        </NavLink>
        <NavLink to={user ? '/account' : '/login'} className={item}>
          <User className="h-5 w-5" /> {user ? 'Account' : 'Sign in'}
        </NavLink>
      </div>
    </nav>
  )
}
