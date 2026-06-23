import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HomeContent from '@/components/HomeContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'Lounge Antico — იტალიური რესტორანი თბილისში | მთავარი',
    description: '2015 წლიდან — პრემიუმ იტალიური სამზარეულო ქართული სტუმართმოყვარეობით. ჯავშანი, ხელნაკეთი პასტა, სეზონური მენიუ. რუსთაველის გამზ. 12, თბილისი.',
  },
  en: {
    title: 'Lounge Antico — Italian Restaurant Tbilisi | Home',
    description: 'Since 2015 — premium Italian cuisine with Georgian hospitality in Tbilisi. Table reservations, handmade pasta, seasonal menu. Rustaveli Ave 12.',
  },
  ru: {
    title: 'Lounge Antico — Итальянский ресторан Тбилиси | Главная',
    description: 'С 2015 года — премиальная итальянская кухня с грузинским гостеприимством. Бронирование, паста ручной работы, сезонное меню. Проспект Руставели 12.',
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
