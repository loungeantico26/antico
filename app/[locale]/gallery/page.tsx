import type { Metadata } from 'next'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import content from '@/data/content.json'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  ka: {
    title: 'გალერეა — ატმოსფერო და კერძები | Lounge Antico',
    description: 'Lounge Antico-ს ფოტო გალერეა. ჩვენი ინტერიერი, სამზარეულო და დაუვიწყარი მომენტები. პრემიუმ ლაუნჯ გარემო თბილისის გულში.',
  },
  en: {
    title: 'Gallery — Atmosphere & Dishes | Lounge Antico',
    description: 'Lounge Antico photo gallery. Our interior, cuisine and unforgettable moments. Premium lounge atmosphere in the heart of Tbilisi.',
  },
  ru: {
    title: 'Галерея — Атмосфера и Блюда | Lounge Antico',
    description: 'Фотогалерея Lounge Antico. Наш интерьер, кухня и незабываемые моменты. Премиальная лаунж-атмосфера в сердце Тбилиси.',
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
  const t = useTranslations('gallery')
  const photos = content.gallery

  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">{t('badge')}</p>
        <h1 className="section-title">{t('title')}</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">{t('subtitle')}</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`relative overflow-hidden group ${idx === 0 || idx === 5 ? 'sm:col-span-2' : ''}`}
                style={{ aspectRatio: idx === 0 || idx === 5 ? '16/7' : '4/3' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-cream font-serif text-lg">{photo.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-dark-card border-t border-dark-border text-center">
        <p className="section-subtitle">{t('ctaSubtitle')}</p>
        <h2 className="text-3xl font-serif text-cream mb-6">{t('ctaTitle')}</h2>
        <div className="gold-divider" />
        <Link href="/reservation" className="btn-primary">{t('ctaBtn')}</Link>
      </section>
    </>
  )
}
