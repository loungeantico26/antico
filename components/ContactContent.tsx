'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import content from '@/data/content.json'

type ContactData = {
  address: string
  phone1: string
  phone2: string
  email1: string
  email2: string
  weekdays: string
  weekends: string
  mapUrl: string
  footerAddress: string
}

export default function ContactContent() {
  const t = useTranslations('contact')
  const [c, setC] = useState<ContactData>(content.contact as ContactData)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
      .single()
      .then(({ data }) => {
        if (data?.value) setC(data.value as ContactData)
      })
  }, [])

  const info = [
    { icon: MapPin, title: t('addressLabel'), lines: [c.address] },
    { icon: Phone, title: t('phoneLabel'), lines: [c.phone1, c.phone2].filter(Boolean) },
    { icon: Mail, title: t('emailLabel'), lines: [c.email1, c.email2].filter(Boolean) },
    { icon: Clock, title: t('hoursLabel'), lines: [c.weekdays, c.weekends].filter(Boolean) },
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

          <div className="w-full border border-dark-border overflow-hidden" style={{ height: '400px' }}>
            <iframe
              src="https://maps.google.com/maps?q=41.9594447,41.7731486&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lounge Antico Restaurant"
            />
          </div>
          <div className="flex justify-center mt-4">
            <a
              href={c.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-6 inline-flex items-center gap-2"
            >
              <MapPin size={14} />
              {t('mapBtn')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
