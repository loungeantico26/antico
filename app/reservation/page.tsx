'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'

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
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'შეცდომა მოხდა')
        setStatus('error')
      }
    } catch {
      setErrorMsg('კავშირის პრობლემა. სცადეთ მოგვიანებით.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-cream mb-4">ჯავშანი მიღებულია!</h2>
          <div className="gold-divider" />
          <p className="text-cream/70 mb-4">
            მადლობა, <strong className="text-gold">{form.name}</strong>!
            თქვენი ჯავშანი წარმატებით გაიგზავნა.
          </p>
          <p className="text-cream/50 text-sm mb-8">
            ჩვენი გუნდი დაგიკავშირდებათ {form.email}-ზე ან {form.phone}-ზე
            ჯავშნის დასადასტურებლად.
          </p>
          <div className="card-dark p-6 text-left mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gold/60 text-xs mb-1">თარიღი</div>
                <div className="text-cream">{form.date}</div>
              </div>
              <div>
                <div className="text-gold/60 text-xs mb-1">დრო</div>
                <div className="text-cream">{form.time}</div>
              </div>
              <div>
                <div className="text-gold/60 text-xs mb-1">სტუმრები</div>
                <div className="text-cream">{form.guests} პირი</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', message: '' }) }}
            className="btn-outline"
          >
            ახალი ჯავშანი
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">Antico Restaurant</p>
        <h1 className="section-title">მაგიდის ჯავშანი</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">
          შეავსეთ ფორმა და ჩვენი გუნდი დაადასტურებს ჯავშანს 24 საათში.
        </p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal info */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">პირადი ინფორმაცია</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="სახელი, გვარი"
                    required
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="ტელეფონი"
                    required
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div className="relative mt-4">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ელ. ფოსტა"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Reservation details */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">ჯავშნის დეტალები</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="input-field pl-11 bg-dark-card"
                  >
                    <option value="">დრო...</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="input-field pl-11 bg-dark-card"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <option key={n} value={String(n)}>{n} {n === 1 ? 'სტუმარი' : 'სტუმარი'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">დამატებითი შენიშვნა</h3>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-gold/40" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="სპეციალური მოთხოვნები, დღეობა, ალერგია..."
                  rows={4}
                  className="input-field pl-11 resize-none"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'იგზავნება...' : 'ჯავშნის გაგზავნა'}
            </button>

            <p className="text-cream/30 text-xs text-center">
              ჩვენი გუნდი დაგიკავშირდებათ ჯავშნის დასადასტურებლად.
            </p>
          </form>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
            <div className="card-dark p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">სამუშაო საათები</div>
              <div className="text-cream/70 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>ორშ — პარ</span>
                  <span className="text-gold">12:00 – 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>შაბ — კვი</span>
                  <span className="text-gold">12:00 – 00:00</span>
                </div>
              </div>
            </div>
            <div className="card-dark p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">ჯავშნის პოლიტიკა</div>
              <p className="text-cream/70 text-sm leading-relaxed">
                10+ სტუმრისთვის გთხოვთ დაგვიკავშირდეთ პირდაპირ ტელეფონით:
                <br />
                <span className="text-gold">+995 322 123 456</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
