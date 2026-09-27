import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

import Logo from '../../components/Logo/Logo'

/** Split layout used by all authentication screens. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto w-full max-w-md">
        <Logo size="md" />
        <h1 className="mt-8 text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-metal-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-metal-500">{footer}</div>}
      </motion.div>
      <motion.aside
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative hidden h-full min-h-[560px] overflow-hidden rounded-[2rem] bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-end"
      >
        <div className="absolute inset-0 bg-grid-fade [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/30 blur-[100px]" />
        <div className="relative">
          <p className="eyebrow text-brand-300">Timeline Global Systems</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">Home of Quality Gadgets.</h2>
          <ul className="mt-8 space-y-3 text-metal-300">
            {['Track every order from placement to delivery', 'Save gadgets to your wishlist', 'Faster checkout with saved addresses'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </div>
  )
}
