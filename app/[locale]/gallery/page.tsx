import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GalleryContent from '@/components/GalleryContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'გალერეა — ატმოსფერო და კერძები | Lounge Antico',
    description: 'Lounge Antico-ს ფოტო გალერეა. ჩვენი ინტერიერი, სამზარეულო და დაუვიწყარი მომენტები.',
  },
  en: {
    title: 'Gallery — Atmosphere & Dishes | Lounge Antico',
    description: 'Lounge Antico photo gallery. Our interior, cuisine and unforgettable moments.',
  },
  ru: {
    title: 'Галерея — Атмосфера и Блюда | Lounge Antico',
    description: 'Фотогалерея Lounge Antico. Наш интерьер, кухня и незабываемые моменты.',
  },
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const meta = pageMeta[locale] ?? pageMeta.ka
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/${locale}/gallery`, images: [{ url: OG_IMAGE }] },
    twitter: { title: meta.title, description: meta.description },
  }
}

export default function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <GalleryContent />
}
