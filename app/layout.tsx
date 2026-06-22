import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lounge Antico — იტალიური რესტორანი თბილისში',
    template: '%s | Lounge Antico',
  },
  description: 'Lounge Antico — პრემიუმ იტალიური სამზარეულო ქართული სტუმართმოყვარეობით. ჯავშანი, სეზონური მენიუ, ხელნაკეთი პასტა. რუსთაველის გამზირი, თბილისი.',
  keywords: [
    'Lounge Antico', 'Antico Tbilisi', 'Italian restaurant Tbilisi',
    'იტალიური რესტორანი', 'Italian restaurant Georgia', 'ресторан Тбилиси',
    'итальянский ресторан Тбилиси', 'fine dining Tbilisi', 'best restaurant Tbilisi',
    'Rustaveli restaurant', 'Rustaveli Avenue dining', 'ჯავშანი', 'reservation Tbilisi',
    'pasta Tbilisi', 'Italian food Tbilisi', 'lounge restaurant Tbilisi',
    'рестаран на Руставели', 'თბილისი რესტორანი', 'ლაუნჯ ანტიკო',
    'ქართული სტუმართმოყვარეობა', 'italian cuisine georgia', 'tbilisi lounge bar',
    'premium restaurant tbilisi', 'georgian italian fusion', 'antico ge',
  ],
  authors: [{ name: 'Lounge Antico', url: SITE_URL }],
  creator: 'Lounge Antico',
  publisher: 'Lounge Antico',
  category: 'restaurant',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: [{ url: '/logo.png' }],
    shortcut: '/logo.png',
  },
  openGraph: {
    siteName: 'Lounge Antico',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Lounge Antico Restaurant Tbilisi' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
