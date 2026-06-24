import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MenuContent from '@/components/MenuContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'მენიუ — ქართული და ევროპული კერძები | Lounge Antico',
    description: 'Lounge Antico-ს სრული მენიუ. სუპები, სალათები, გრილი, პიცა, ზღვის პროდუქტები, დესერტები, სასმელები. სეზონური ინგრედიენტები. ფასები ლარში.',
  },
  en: {
    title: 'Menu — Georgian & European Dishes | Lounge Antico',
    description: 'Full menu at Lounge Antico Shekvetili. Soups, salads, grills, pizza, seafood, desserts, coffee and drinks. Fresh seasonal ingredients. Prices in GEL.',
  },
  ru: {
    title: 'Меню — Грузинские и европейские блюда | Lounge Antico',
    description: 'Полное меню Lounge Antico Шекветили. Супы, салаты, гриль, пицца, морепродукты, десерты, кофе и напитки. Свежие сезонные ингредиенты. Цены в GEL.',
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
