import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import JsonLd from '@/components/JsonLd'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type LocaleMeta = { title: string; description: string; ogLocale: string }

const localeMeta: Record<string, LocaleMeta> = {
  ka: {
    title: 'Lounge Antico — ქართული და ევროპული სამზარეულო შეკვეთილში',
    description: '2023 წლიდან — ქართული და ევროპული სამზარეულო შეკვეთილის დენდროლოგიური პარკის შესასვლელში. გარე მაგიდები, ჯავშანი, სეზონური მენიუ.',
    ogLocale: 'ka_GE',
  },
  en: {
    title: 'Lounge Antico — Georgian & European Restaurant in Shekvetili',
    description: 'Since 2023 — Georgian and European cuisine at the entrance of Shekvetili Dendrological Park. Outdoor seating, large parking, table reservations.',
    ogLocale: 'en_US',
  },
  ru: {
    title: 'Lounge Antico — Грузинская и европейская кухня в Шекветили',
    description: 'С 2023 года — грузинская и европейская кухня у входа в Дендрологический парк Шекветили. Открытая терраса, большая парковка, бронирование столов.',
    ogLocale: 'ru_RU',
  },
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const meta = localeMeta[locale] ?? localeMeta.ka

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ka: `${SITE_URL}/ka`,
        en: `${SITE_URL}/en`,
        ru: `${SITE_URL}/ru`,
        'x-default': `${SITE_URL}/ka`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'Lounge Antico',
      locale: meta.ogLocale,
      alternateLocale: Object.values(localeMeta)
        .filter((m) => m.ogLocale !== meta.ogLocale)
        .map((m) => m.ogLocale),
      type: 'website',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Lounge Antico — Restaurant Shekvetili, Georgia',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <html lang={locale}>
      <body>
        <JsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
