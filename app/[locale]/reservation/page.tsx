'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'

type FormData = {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  message: string
}

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

export default function ReservationPage() {
  const t = useTranslations('reservation')
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        supabase.from('profiles').select('name, email, phone').eq('id', user.id).single()
          .then(({ data: profile }) => {
            if (profile) {
              setForm((prev) => ({
                ...prev,
                name: profile.name || prev.name,
                email: profile.email || prev.email,
                phone: profile.phone || prev.phone,
              }))
            }
          })
      }
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const { error } = await supabase.from('reservations').insert({
        user_id: userId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        guests: parseInt(form.guests),
        message: form.message,
        status: 'pending',
      })

      if (error) throw error

      setStatus('success')
    } catch {
      setErrorMsg(t('connectionError'))
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-cream mb-4">{t('successTitle')}</h2>
          <div className="gold-divider" />
          <p className="text-cream/70 mb-4">
            {t('successText')}, <strong className="text-gold">{form.name}</strong>!
          </p>
          <p className="text-cream/50 text-sm mb-8">{t('successNote')}</p>
          <div className="card-dark p-6 text-left mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gold/60 text-xs mb-1">{t('dateLabel')}</div>
                <div className="text-cream">{form.date}</div>
              </div>
              <div>
                <div className="text-gold/60 text-xs mb-1">{t('timeLabel')}</div>
                <div className="text-cream">{form.time}</div>
              </div>
              <div>
                <div className="text-gold/60 text-xs mb-1">{t('guestsLabel')}</div>
                <div className="text-cream">{form.guests} {t('personSuffix')}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setStatus('idle')
              setForm((prev) => ({ ...prev, date: '', time: '', guests: '2', message: '' }))
            }}
            className="btn-outline"
          >
            {t('newReservation')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">{t('badge')}</p>
        <h1 className="section-title">{t('title')}</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">{t('subtitle')}</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder={t('namePlaceholder')} required className="input-field pl-11" />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder={t('phonePlaceholder')} required className="input-field pl-11" />
                </div>
              </div>
              <div className="relative mt-4">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder={t('emailPlaceholder')} required className="input-field pl-11" />
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('details')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required min={new Date().toISOString().split('T')[0]} className="input-field pl-11" />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <select name="time" value={form.time} onChange={handleChange}
                    required className="input-field pl-11 bg-dark-card">
                    <option value="">{t('timePlaceholder')}</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <select name="guests" value={form.guests} onChange={handleChange}
                    className="input-field pl-11 bg-dark-card">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={String(n)}>{n} {t('guestSuffix')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('noteTitle')}</h3>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-gold/40" />
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder={t('notePlaceholder')} rows={4} className="input-field pl-11 resize-none" />
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'loading' ? t('submitting') : t('submitBtn')}
            </button>

            <p className="text-cream/30 text-xs text-center">{t('submitNote')}</p>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
            <div className="card-dark p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('hoursTitle')}</div>
              <div className="text-cream/70 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Mon — Fri</span>
                  <span className="text-gold">12:00 – 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sat — Sun</span>
                  <span className="text-gold">12:00 – 00:00</span>
                </div>
              </div>
            </div>
            <div className="card-dark p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('policyTitle')}</div>
              <p className="text-cream/70 text-sm leading-relaxed">{t('policyText')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
