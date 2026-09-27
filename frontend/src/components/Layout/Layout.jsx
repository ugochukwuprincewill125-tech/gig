import { useState } from 'react'

import CartDrawer from '../CartDrawer/CartDrawer'
import Footer from '../Footer/Footer'
import MobileBottomNav from '../Navbar/MobileBottomNav'
import Navbar, { SearchOverlay } from '../Navbar/Navbar'

export default function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <main id="main" className="flex-1 pb-16 sm:pb-0">
        {children}
      </main>
      <Footer />
      <div className="h-16 sm:hidden" aria-hidden />
      <MobileBottomNav onOpenSearch={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
