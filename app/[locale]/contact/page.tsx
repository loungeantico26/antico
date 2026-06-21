import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import content from '@/data/content.json'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('contact')
  const c = content.contact

  const info = [
    { icon: MapPin, title: t('addressLabel'), lines: [c.address] },
    { icon: Phone, title: t('phoneLabel'), lines: [c.phone1, c.phone2] },
    { icon: Mail, title: t('emailLabel'), lines: [c.email1, c.email2] },
    { icon: Clock, title: t('hoursLabel'), lines: [c.weekdays, c.weekends] },
  ]

  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">{t('badge')}</p>
        <h1 className="section-title">{t('title')}</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">{t('subtitle')}</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {info.map((item) => (
              <div key={item.title} className="card-dark p-8 text-center group hover:border-gold/40 transition-colors duration-300">
                <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <item.icon size={22} className="text-gold" />
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{item.title}</div>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-cream/70 text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="w-full h-80 bg-dark-card border border-dark-border flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-gold mx-auto mb-3" />
              <p className="text-cream/40 text-sm">{c.address}</p>
              <a href={c.mapUrl} target="_blank" rel="noopener noreferrer"
                className="btn-outline text-xs py-2 px-5 mt-4 inline-block">
                {t('mapBtn')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
