'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, UserCircle, LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const locales = ['ka', 'en', 'ru'] as const
const localeLabels: Record<string, string> = { ka: 'ქარ', en: 'ENG', ru: 'РУС' }

export default function Navbar() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ka'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setLoggedIn(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const links = [
    { href: '/' as const, label: t('home') },
    { href: '/menu' as const, label: t('menu') },
    { href: '/gallery' as const, label: t('gallery') },
    { href: '/contact' as const, label: t('contact') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-dark/95 backdrop-blur-sm border-b border-dark-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-16 h-16 shrink-0">
            <Image
              src="/logo.png"
              alt="Lounge Antico"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
          <div className="leading-none">
            <div className="text-[10px] tracking-[0.4em] text-gold/70 uppercase mb-0.5">Lounge</div>
            <div className="text-xl font-serif text-gold tracking-[0.25em] group-hover:text-gold-light transition-colors duration-300">
              ANTICO
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-primary text-xs py-2 px-6">
            {t('bookTable')}
          </Link>

          {/* Auth link */}
          <Link
            href={loggedIn ? '/account' : '/auth/login'}
            className="flex items-center gap-1.5 text-cream/50 hover:text-gold transition-colors duration-200"
            title={loggedIn ? t('account') : t('login')}
          >
            {loggedIn ? <UserCircle size={20} className="text-gold" /> : <LogIn size={18} />}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-1 border-l border-dark-border pl-4">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => router.replace(pathname, { locale })}
                className={`text-xs tracking-wider px-2 py-1 transition-colors duration-200 ${
                  currentLocale === locale
                    ? 'text-gold'
                    : 'text-cream/40 hover:text-cream/70'
                }`}
              >
                {localeLabels[locale]}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream p-2"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark/98 border-t border-dark-border">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-6 py-4 nav-link border-b border-dark-border/50 text-base"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={loggedIn ? '/account' : '/auth/login'}
            className="flex items-center gap-2 px-6 py-4 nav-link border-b border-dark-border/50 text-base"
            onClick={() => setOpen(false)}
          >
            {loggedIn ? <UserCircle size={18} className="text-gold" /> : <LogIn size={18} />}
            {loggedIn ? t('account') : t('login')}
          </Link>
          <div className="flex items-center gap-3 px-6 py-4">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => { router.replace(pathname, { locale }); setOpen(false) }}
                className={`text-sm tracking-wider px-3 py-1 border transition-colors duration-200 ${
                  currentLocale === locale
                    ? 'border-gold text-gold'
                    : 'border-dark-border text-cream/40 hover:border-gold/40 hover:text-cream/70'
                }`}
              >
                {localeLabels[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
