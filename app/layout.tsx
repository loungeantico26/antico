import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lounge Antico — რესტორანი შეკვეთილში',
    template: '%s | Lounge Antico',
  },
  description: 'Lounge Antico — ქართული და ევროპული სამზარეულო შეკვეთილის დენდროლოგიური პარკის მოპირდაპირე მხარეს. ჯავშანი, სეზონური მენიუ, გარე მაგიდები, დიდი პარკინგი.',
  keywords: [
    'Lounge Antico', 'Antico Shekvetili', 'restaurant Shekvetili',
    'ქართული რესტორანი', 'Georgian restaurant Georgia', 'ресторан Шекветили',
    'грузинский ресторан Шекветили', 'restaurant Ozurgeti', 'best restaurant Shekvetili',
    'dendrological park restaurant', 'შეკვეთილი რესტორანი', 'ლაუნჯ ანტიკო',
    'ქართული სამზარეულო', 'european cuisine georgia', 'shekvetili lounge',
    'ოზურგეთი რესტორანი', 'дендрологический парк', 'lounge antico ge',
    'შეკვეთილი', 'antico ge', 'ჯავშანი შეკვეთილი',
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
