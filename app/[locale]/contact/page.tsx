import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactContent from '@/components/ContactContent'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'კონტაქტი — მისამართი და სამუშაო საათები | Lounge Antico',
    description: 'Lounge Antico კონტაქტი. მისამართი: რუსთაველის გამზ. 12, თბილისი. ტელ: +995 322 123 456. სამუშაო საათები: ყოველდღე 12:00–23:00.',
  },
  en: {
    title: 'Contact — Address & Opening Hours | Lounge Antico',
    description: 'Lounge Antico contact. Address: Rustaveli Ave 12, Tbilisi. Tel: +995 322 123 456. Opening hours: daily 12:00–23:00.',
  },
  ru: {
    title: 'Контакты — Адрес и Часы работы | Lounge Antico',
    description: 'Контакты Lounge Antico. Адрес: просп. Руставели 12, Тбилиси. Тел: +995 322 123 456. Часы работы: ежедневно 12:00–23:00.',
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
