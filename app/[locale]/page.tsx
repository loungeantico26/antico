import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HomeContent from '@/components/HomeContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'Lounge Antico — შეკვეთილი | მთავარი',
    description: '2023 წლიდან — ქართული და ევროპული სამზარეულო დენდროლოგიური პარკის მოპირდაპირე მხარეს. გარე მაგიდები, ავტოსადგომი, ჯავშანი. შეკვეთილი, ოზურგეთი.',
  },
  en: {
    title: 'Lounge Antico — Shekvetili | Home',
    description: 'Since 2023 — Georgian and European cuisine across from the Shekvetili Dendrological Park. Outdoor seating, bus parking, table reservations. Ozurgeti.',
  },
  ru: {
    title: 'Lounge Antico — Шекветили | Главная',
    description: 'С 2023 года — грузинская и европейская кухня напротив Дендрологического парка Шекветили. Открытая терраса, парковка для автобусов, бронирование.',
  },
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const meta = pageMeta[locale] ?? pageMeta.ka
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/${locale}`, images: [{ url: OG_IMAGE }] },
    twitter: { title: meta.title, description: meta.description },
  }
}

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <HomeContent />
}
