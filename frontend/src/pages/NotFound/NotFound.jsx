import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

import Button from '../../components/Button/Button'
import Seo from '../../components/Seo/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <div className="container flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="bg-gradient-to-b from-ink-900 to-metal-300 bg-clip-text font-display text-[7rem] font-bold leading-none text-transparent sm:text-[10rem]"
        >
          404
        </motion.p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">This page went off the timeline</h1>
        <p className="mt-3 max-w-md text-metal-500">The page you’re looking for doesn’t exist or may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/" icon={ArrowLeft}>
            Back to home
          </Button>
          <Button to="/shop" variant="outline" icon={Search}>
            Browse products
          </Button>
        </div>
      </div>
    </>
  )
}
