'use client'

import { Download } from 'lucide-react'

const SITE_URL = 'https://antico-9f4.pages.dev'

const pages = [
  { label: 'მთავარი გვერდი', path: '/ka' },
  { label: 'მენიუ', path: '/ka/menu' },
  { label: 'ჯავშანი', path: '/ka/reservation' },
  { label: 'კონტაქტი', path: '/ka/contact' },
]

export default function TabQR() {
  return (
    <div className="space-y-6">
      <p className="text-cream/40 text-sm">QR კოდები საიტის სხვადასხვა გვერდისთვის — დაბეჭდე და მაგიდაზე დადე.</p>

      <div className="grid grid-cols-2 gap-4">
        {pages.map(({ label, path }) => {
          const url = `${SITE_URL}${path}`
          const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=1a1a1a&margin=10`

          return (
            <div key={path} className="border border-dark-border bg-dark-card/30 p-6 text-center space-y-4">
              <div className="text-xs uppercase tracking-widest text-gold/60">{label}</div>
              <div className="flex justify-center">
                <div className="bg-white p-2 inline-block">
                  <img src={qrSrc} alt={`QR - ${label}`} width={160} height={160} />
                </div>
              </div>
              <div className="text-cream/20 text-xs break-all">{url}</div>
              <a
                href={qrSrc}
                download={`qr-antico-${label}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-gold transition-colors mx-auto w-fit"
              >
                <Download size={12} /> ჩამოტვირთვა
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
