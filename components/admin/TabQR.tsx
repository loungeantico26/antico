'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'

const SITE_URL = 'https://antico-9f4.pages.dev'

const pages = [
  { label: 'მთავარი გვერდი', path: '/ka' },
  { label: 'მენიუ', path: '/ka/menu' },
  { label: 'ჯავშანი', path: '/ka/reservation' },
  { label: 'კონტაქტი', path: '/ka/contact' },
]

export default function TabQR() {
  function downloadQR(path: string, label: string) {
    const svg = document.getElementById(`qr-${label}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 50, 50, 300, 300)
      const a = document.createElement('a')
      a.download = `qr-antico-${label}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="space-y-6">
      <p className="text-cream/40 text-sm">QR კოდები საიტის სხვადასხვა გვერდისთვის — დაბეჭდე და მაგიდაზე დადე.</p>

      <div className="grid grid-cols-2 gap-4">
        {pages.map(({ label, path }) => {
          const url = `${SITE_URL}${path}`
          return (
            <div key={path} className="border border-dark-border bg-dark-card/30 p-6 text-center space-y-4">
              <div className="text-xs uppercase tracking-widest text-gold/60">{label}</div>
              <div className="flex justify-center">
                <div className="bg-white p-3 inline-block">
                  <QRCodeSVG
                    id={`qr-${label}`}
                    value={url}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#1a1a1a"
                    level="M"
                  />
                </div>
              </div>
              <div className="text-cream/20 text-xs break-all">{url}</div>
              <button
                type="button"
                onClick={() => downloadQR(path, label)}
                className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-gold transition-colors mx-auto"
              >
                <Download size={12} /> ჩამოტვირთვა
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
