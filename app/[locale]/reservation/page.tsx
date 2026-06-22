'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, User, Phone, Mail, MessageSquare, CheckCircle, UtensilsCrossed, Package, CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import OrderMenu, { CartItem } from '@/components/OrderMenu'

type FormData = {
  name: string
  phone: string
  email: string
  personal_id: string
  date: string
  time: string
  guests: string
  message: string
}

type OrderType = 'dine-in' | 'takeout'

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

export default function ReservationPage() {
  const t = useTranslations('reservation')
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', personal_id: '', date: '', time: '', guests: '2', message: '',
  })
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPreOrder, setShowPreOrder] = useState(false)
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

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (orderType === 'takeout' && cart.length === 0) {
      setErrorMsg(t('cartRequired'))
      return
    }

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
        personal_id: form.personal_id,
        guests: orderType === 'dine-in' ? parseInt(form.guests) : 0,
        message: form.message,
        status: 'pending',
        order_type: orderType,
        pre_order_items: cart,
        pre_order_total: cartTotal,
      })

      if (error) throw error
      setStatus('success')
    } catch {
      setErrorMsg(t('connectionError'))
      setStatus('error')
    }
  }

  // ── Success screen ──
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md w-full">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-cream mb-4">{t('successTitle')}</h2>
          <div className="gold-divider" />
          <p className="text-cream/70 mb-2">
            {t('successText')}, <strong className="text-gold">{form.name}</strong>!
          </p>
          <p className="text-cream/50 text-sm mb-8">{t('successNote')}</p>

          <div className="card-dark p-6 text-left mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-gold/60 text-xs mb-1">
                  {orderType === 'takeout' ? t('pickupDate') : t('dateLabel')}
                </div>
                <div className="text-cream">{form.date}</div>
              </div>
              <div>
                <div className="text-gold/60 text-xs mb-1">
                  {orderType === 'takeout' ? t('pickupTime') : t('timeLabel')}
                </div>
                <div className="text-cream">{form.time}</div>
              </div>
              {orderType === 'dine-in' && (
                <div>
                  <div className="text-gold/60 text-xs mb-1">{t('guestsLabel')}</div>
                  <div className="text-cream">{form.guests} {t('personSuffix')}</div>
                </div>
              )}
              <div>
                <div className="text-gold/60 text-xs mb-1">ტიპი</div>
                <div className="text-cream">{orderType === 'dine-in' ? t('dineIn') : t('takeout')}</div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-dark-border pt-4 space-y-2">
                <div className="text-xs text-gold/60 uppercase tracking-wider mb-2">{t('orderSummary')}</div>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-cream/70">{item.name} × {item.quantity}</span>
                    <span className="text-gold">₾{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-dark-border">
                  <span className="text-cream">{t('total')}</span>
                  <span className="text-gold font-serif">₾{cartTotal}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setStatus('idle')
              setForm((prev) => ({ ...prev, date: '', time: '', guests: '2', message: '' }))
              setCart([])
              setShowPreOrder(false)
            }}
            className="btn-outline"
          >
            {t('newReservation')}
          </button>
        </div>
      </div>
    )
  }

  // ── Main form ──
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

          {/* Order type toggle */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              type="button"
              onClick={() => { setOrderType('dine-in'); setShowPreOrder(false); setCart([]) }}
              className={`p-5 border text-left transition-all duration-200 ${
                orderType === 'dine-in'
                  ? 'border-gold bg-gold/10'
                  : 'border-dark-border hover:border-gold/30'
              }`}
            >
              <UtensilsCrossed size={22} className={`mb-3 ${orderType === 'dine-in' ? 'text-gold' : 'text-cream/30'}`} />
              <div className={`font-serif text-lg mb-1 ${orderType === 'dine-in' ? 'text-gold' : 'text-cream/60'}`}>
                {t('dineIn')}
              </div>
              <div className="text-cream/40 text-xs">{t('dineInSub')}</div>
            </button>

            <button
              type="button"
              onClick={() => { setOrderType('takeout'); setShowPreOrder(true); setCart([]) }}
              className={`p-5 border text-left transition-all duration-200 ${
                orderType === 'takeout'
                  ? 'border-gold bg-gold/10'
                  : 'border-dark-border hover:border-gold/30'
              }`}
            >
              <Package size={22} className={`mb-3 ${orderType === 'takeout' ? 'text-gold' : 'text-cream/30'}`} />
              <div className={`font-serif text-lg mb-1 ${orderType === 'takeout' ? 'text-gold' : 'text-cream/60'}`}>
                {t('takeout')}
              </div>
              <div className="text-cream/40 text-xs">{t('takeoutSub')}</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal info */}
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
              <div className="relative mt-4">
                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                <input type="text" name="personal_id" value={form.personal_id} onChange={handleChange}
                  placeholder={t('personalIdPlaceholder')} maxLength={11} className="input-field pl-11" />
              </div>
            </div>

            {/* Date / Time / Guests */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {orderType === 'takeout' ? t('pickupTime') : t('details')}
              </h3>
              <div className={`grid gap-4 ${orderType === 'dine-in' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2'}`}>
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
                {orderType === 'dine-in' && (
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
                    <select name="guests" value={form.guests} onChange={handleChange}
                      className="input-field pl-11 bg-dark-card">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={String(n)}>{n} {t('guestSuffix')}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Pre-order toggle (dine-in only) */}
            {orderType === 'dine-in' && (
              <div>
                <button
                  type="button"
                  onClick={() => { setShowPreOrder(!showPreOrder); if (showPreOrder) setCart([]) }}
                  className={`w-full flex items-center justify-between px-5 py-4 border transition-all duration-200 ${
                    showPreOrder ? 'border-gold bg-gold/5' : 'border-dark-border hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed size={16} className={showPreOrder ? 'text-gold' : 'text-cream/30'} />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${showPreOrder ? 'text-gold' : 'text-cream/60'}`}>
                        {t('preOrderToggle')}
                      </div>
                      <div className="text-cream/30 text-xs mt-0.5">{t('preOrderNote')}</div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${showPreOrder ? 'bg-gold' : 'bg-dark-border'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-dark transition-all ${showPreOrder ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            )}

            {/* Menu (always shown for takeout, toggleable for dine-in) */}
            {(orderType === 'takeout' || showPreOrder) && (
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('menuBrowse')}</h3>
                <OrderMenu
                  cart={cart}
                  onCartChange={setCart}
                  totalLabel={t('total')}
                  emptyLabel={t('cartEmpty')}
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('noteTitle')}</h3>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-gold/40" />
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder={t('notePlaceholder')} rows={3} className="input-field pl-11 resize-none" />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? t('submitting') : t('submitBtn')}
            </button>

            <p className="text-cream/30 text-xs text-center">{t('submitNote')}</p>
          </form>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
            <div className="card-dark p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('hoursTitle')}</div>
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
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('policyTitle')}</div>
              <p className="text-cream/70 text-sm leading-relaxed">{t('policyText')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
