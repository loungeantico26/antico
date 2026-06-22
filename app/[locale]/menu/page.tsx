import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MenuContent from '@/components/MenuContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'მენიუ — იტალიური კერძები | Lounge Antico',
    description: 'Lounge Antico-ს სრული მენიუ. ხელნაკეთი პასტა, პიცა, ზღვის პროდუქტები, ტრიუფელი, ტირამისუ. სეზონური ინგრედიენტები. ფასები GEL-ში.',
  },
  en: {
    title: 'Menu — Italian Dishes | Lounge Antico',
    description: 'Full menu at Lounge Antico Tbilisi. Handmade pasta, pizza, seafood, truffle, tiramisu. Seasonal fresh ingredients. Prices in GEL.',
  },
  ru: {
    title: 'Меню — Итальянские блюда | Lounge Antico',
    description: 'Полное меню Lounge Antico Тбилиси. Паста ручной работы, пицца, морепродукты, трюфель, тирамису. Сезонные ингредиенты. Цены в GEL.',
  },
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const meta = pageMeta[locale] ?? pageMeta.ka
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/${locale}/menu`, images: [{ url: OG_IMAGE }] },
    twitter: { title: meta.title, description: meta.description },
  }
}

export default function MenuPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <MenuContent />
}
