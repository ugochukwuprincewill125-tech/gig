import { Clock, CreditCard, Mail, MapPin, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

import useStoreInfo from '../../hooks/useStoreInfo'
import InstagramIcon from '../Icons/InstagramIcon'
import Logo from '../Logo/Logo'
import Reveal from '../Motion/Reveal'

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/contact#locations', label: 'Our Locations' },
      { to: '/brands', label: 'Brands' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { to: '/shipping', label: 'Shipping Information' },
      { to: '/returns', label: 'Returns' },
      { to: '/faqs', label: 'FAQs' },
      { to: '/track-order', label: 'Track Order' },
      { to: '/contact', label: 'Contact Support' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { to: '/category/smartphones', label: 'Smartphones' },
      { to: '/category/laptops', label: 'Laptops' },
      { to: '/category/phone-accessories', label: 'Accessories' },
      { to: '/category/networking-devices', label: 'Networking' },
      { to: '/category/gaming-accessories', label: 'Gaming' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/account', label: 'My Account' },
      { to: '/account/orders', label: 'Orders' },
      { to: '/account/wishlist', label: 'Wishlist' },
      { to: '/cart', label: 'Cart' },
    ],
  },
]

const PERKS = [
  { icon: Truck, title: 'Nationwide delivery', text: 'Lagos & all 36 states' },
  { icon: ShieldCheck, title: 'Quality gadgets', text: 'Carefully selected stock' },
  { icon: CreditCard, title: 'Secure payments', text: 'Processed via Paystack' },
  { icon: Clock, title: 'Real support', text: 'Talk to our team' },
]

export default function Footer() {
  const { company } = useStoreInfo()
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 text-metal-300">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="container relative">
        <div className="grid grid-cols-2 gap-6 border-b border-white/10 py-10 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.05} className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-inset ring-white/10">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs text-metal-400">{text}</span>
              </span>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo onDark size="lg" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-metal-400">
              {company.name} supplies quality phones, computers, accessories and technology solutions from the heart of Computer Village, Ikeja.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="font-semibold text-white">{company.name}</p>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 hover:text-white">
                <Mail className="h-4 w-4 text-brand-400" /> {company.email}
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-400" /> Computer Village, Ikeja, Lagos.
              </p>
              {company.phones?.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-white">
                  {phone}
                </a>
              ))}
            </div>
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <InstagramIcon className="h-4 w-4" /> Follow {company.instagram_handle}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-sans text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-metal-400 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-metal-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Timeline Global Systems Limited. All Rights Reserved.</p>
          <p>Home of Quality Gadgets · Computer Village, Ikeja, Lagos</p>
        </div>
      </div>
    </footer>
  )
}
