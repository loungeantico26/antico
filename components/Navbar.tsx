'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'მთავარი' },
  { href: '/menu', label: 'მენიუ' },
  { href: '/gallery', label: 'გალერეა' },
  { href: '/reservation', label: 'ჯავშანი' },
  { href: '/contact', label: 'კონტაქტი' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-dark/95 backdrop-blur-sm border-b border-dark-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/logo.png"
              alt="Lounge Antico"
              fill
              className="object-contain"
              style={{
                filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(2deg) brightness(1.1)',
                mixBlendMode: 'screen',
              }}
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
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-primary text-xs py-2 px-6">
            ჯავშანი
          </Link>
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
        </div>
      )}
    </header>
  )
}
