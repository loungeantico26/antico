'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { Crown, Calendar, Star, LogOut, Phone, Mail, Users, Clock } from 'lucide-react'

type Profile = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  is_vip: boolean
  discount_percent: number
}

type Reservation = {
  id: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  message: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  confirmed: 'text-green-400 border-green-400/30 bg-green-400/10',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/10',
}

export default function AccountPage() {
  const t = useTranslations('account')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const [{ data: prof }, { data: reservs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
    ])

    setProfile(prof)
    setReservations(reservs || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cream/40 text-sm animate-pulse">{t('loading')}</div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">{t('badge')}</p>
        <h1 className="section-title">{t('title')}</h1>
        <div className="gold-divider" />
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Profile card */}
          <div className="card-dark p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-serif text-cream">{profile.name || t('noName')}</h2>
                  {profile.is_vip && (
                    <span className="flex items-center gap-1.5 bg-gold/20 text-gold border border-gold/40 text-xs px-3 py-1">
                      <Crown size={12} /> VIP
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cream/60 text-sm">
                    <Mail size={14} className="text-gold/50 shrink-0" />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-cream/60 text-sm">
                      <Phone size={14} className="text-gold/50 shrink-0" />
                      {profile.phone}
                    </div>
                  )}
                </div>
                {profile.discount_percent > 0 && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2">
                    <Star size={14} className="text-gold fill-gold" />
                    <span className="text-gold text-sm font-medium">
                      {t('discount')}: {profile.discount_percent}%
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-cream/40 hover:text-cream/70 text-sm transition-colors border border-dark-border px-4 py-2 hover:border-gold/30"
              >
                <LogOut size={14} />
                {t('logout')}
              </button>
            </div>
          </div>

          {/* Reservations */}
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-6">{t('myReservations')}</div>

            {reservations.length === 0 ? (
              <div className="card-dark p-10 text-center">
                <Calendar size={36} className="text-gold/20 mx-auto mb-4" />
                <p className="text-cream/40 text-sm mb-6">{t('noReservations')}</p>
                <Link href="/reservation" className="btn-outline text-xs py-2 px-6">
                  {t('myReservations')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((r) => (
                  <div key={r.id} className="card-dark p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <div className="text-xs text-gold/50 uppercase tracking-wider mb-1">{t('date')}</div>
                          <div className="text-cream font-serif">{r.date}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gold/50 uppercase tracking-wider mb-1">{t('time')}</div>
                          <div className="flex items-center gap-1.5 text-cream">
                            <Clock size={13} className="text-gold/40" />
                            {r.time}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gold/50 uppercase tracking-wider mb-1">{t('guests')}</div>
                          <div className="flex items-center gap-1.5 text-cream">
                            <Users size={13} className="text-gold/40" />
                            {r.guests}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 border rounded-none ${STATUS_COLORS[r.status] || 'text-cream/40 border-dark-border'}`}>
                        {t(r.status)}
                      </span>
                    </div>
                    {r.message && (
                      <p className="text-cream/40 text-xs mt-3 pt-3 border-t border-dark-border">
                        {r.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
