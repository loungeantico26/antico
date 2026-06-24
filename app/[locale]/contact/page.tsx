import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactContent from '@/components/ContactContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'კონტაქტი — მისამართი და სამუშაო საათები | Lounge Antico',
    description: 'Lounge Antico კონტაქტი. მისამართი: შეკვეთილი, ოზურგეთი, საქართველო. ტელ: +995 591 40 38 32. სამუშაო საათები: ყოველდღე 12:00–00:00.',
  },
  en: {
    title: 'Contact — Address & Opening Hours | Lounge Antico',
    description: 'Lounge Antico contact. Address: Shekvetili (Natanebi), Ozurgeti, Georgia. Tel: +995 591 40 38 32. Opening hours: daily 12:00–midnight.',
  },
  ru: {
    title: 'Контакты — Адрес и Часы работы | Lounge Antico',
    description: 'Контакты Lounge Antico. Адрес: Шекветили (Натанеби), Озургети, Грузия. Тел: +995 591 40 38 32. Часы работы: ежедневно 12:00–00:00.',
  },
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const meta = pageMeta[locale] ?? pageMeta.ka
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/${locale}/contact`, images: [{ url: OG_IMAGE }] },
    twitter: { title: meta.title, description: meta.description },
  }
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <ContactContent />
}
