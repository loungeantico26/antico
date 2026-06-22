import type { Metadata } from 'next'
import Image from 'next/image'
import { ChevronDown, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import content from '@/data/content.json'
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

const features = [
  { icon: '⭐', keys: ['feature1Title', 'feature1Desc'] as const },
  { icon: '👥', keys: ['feature2Title', 'feature2Desc'] as const },
  { icon: '🕐', keys: ['feature3Title', 'feature3Desc'] as const },
  { icon: '📍', keys: ['feature4Title', 'feature4Desc'] as const },
]

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('home')
  const { hero, about, cta, testimonials } = content

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={hero.backgroundUrl} alt="Lounge Antico" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-dark/70" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <p className="section-subtitle">{t('heroBadge')}</p>
          <h1 className="text-6xl md:text-8xl font-serif text-cream mb-6 leading-tight">ANTICO</h1>
          <div className="gold-divider" />
          <p className="text-cream/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
            {t('heroSubheading')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation" className="btn-primary">{t('heroCta1')}</Link>
            <Link href="/menu" className="btn-outline">{t('heroCta2')}</Link>
          </div>
        </div>
        <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold animate-bounce">
          <ChevronDown size={32} />
        </a>
      </section>

      {/* About */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle">{t('aboutBadge')}</p>
            <h2 className="section-title">{t('aboutHeading')}</h2>
            <div className="w-16 h-px bg-gold mb-8" />
            <p className="text-cream/70 leading-relaxed mb-6">{t('aboutText1')}</p>
            <p className="text-cream/70 leading-relaxed mb-10">{t('aboutText2')}</p>
            <Link href="/gallery" className="btn-outline">{t('aboutCta')}</Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image src={about.imageUrl} alt="Chef at Antico" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 card-dark p-6 w-48">
              <div className="text-5xl font-serif text-gold">{about.yearsLabel}</div>
              <div className="text-cream/60 text-sm mt-1">{t('aboutYearsText')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle">{t('featuresSubtitle')}</p>
            <h2 className="section-title">{t('featuresTitle')}</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 border border-gold/40 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-cream font-serif text-xl mb-3">{t(f.keys[0])}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{t(f.keys[1])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="section-subtitle">{t('menuSubtitle')}</p>
          <h2 className="section-title">{t('menuTitle')}</h2>
          <div className="gold-divider" />
          <p className="text-cream/60 mb-12 max-w-xl mx-auto">{t('menuText')}</p>
          <Link href="/menu" className="btn-primary">{t('menuCta')}</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle">{t('testimonialsSubtitle')}</p>
            <h2 className="section-title">{t('testimonialsTitle')}</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((tt) => (
              <div key={tt.id} className="card-dark p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: tt.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-cream/70 italic mb-6 leading-relaxed">&quot;{tt.text}&quot;</p>
                <div className="text-gold font-serif">{tt.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={cta.backgroundUrl} alt="Restaurant atmosphere" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="section-subtitle">{t('ctaBadge')}</p>
          <h2 className="section-title">{t('ctaHeading')}</h2>
          <div className="gold-divider" />
          <p className="text-cream/70 mb-10">{t('ctaText')}</p>
          <Link href="/reservation" className="btn-primary">{t('ctaBtn')}</Link>
        </div>
      </section>
    </>
  )
}
