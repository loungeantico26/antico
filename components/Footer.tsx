import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import content from '@/data/content.json'

export default function Footer() {
  const { site, contact } = content

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-0">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Lounge Antico"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(2deg)', mixBlendMode: 'screen' }}
                />
              </div>
              <div>
                <div className="text-[9px] tracking-[0.4em] text-gold/60 uppercase">Lounge</div>
                <h3 className="text-xl font-serif text-gold tracking-[0.25em]">ANTICO</h3>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed mb-6">{site.tagline}</p>
            <div className="flex gap-4">
              {['fb', 'ig', 'tw'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 border border-dark-border flex items-center justify-center text-cream/40 hover:border-gold hover:text-gold transition-all duration-200 text-xs uppercase">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">ნავიგაცია</h4>
            <ul className="space-y-3">
              {[
                { href: '/menu', label: 'მენიუ' },
                { href: '/gallery', label: 'გალერეა' },
                { href: '/reservation', label: 'ჯავშანი' },
                { href: '/contact', label: 'კონტაქტი' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/60 hover:text-gold text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">კონტაქტი</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-cream/60 text-sm">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>{contact.footerAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-cream/60 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                <span>{contact.phone1}</span>
              </li>
              <li className="flex items-center gap-3 text-cream/60 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <span>{contact.email1}</span>
              </li>
              <li className="flex items-start gap-3 text-cream/60 text-sm">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                <span>{contact.weekdays}<br />{contact.weekends}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-xs">{site.footerText}</p>
          <Link href="/admin" className="text-cream/20 hover:text-cream/40 text-xs transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
