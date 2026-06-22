'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, TrendingUp, Users, Package, UtensilsCrossed, RefreshCw, Clock } from 'lucide-react'

type Reservation = {
  id: string
  status: string
  order_type: string
  pre_order_total: number
  pre_order_items: { id: string; name: string; quantity: number; price: number }[]
  date: string
  created_at: string
}

type StatCard = { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string }

export default function TabStats() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('reservations').select('*')
    setReservations(data || [])
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]
  const todayRes = reservations.filter((r) => r.date === today)
  const pending = reservations.filter((r) => r.status === 'pending')
  const confirmed = reservations.filter((r) => r.status === 'confirmed')
  const takeouts = reservations.filter((r) => r.order_type === 'takeout')
  const takeoutRevenue = takeouts.reduce((sum, r) => sum + (r.pre_order_total || 0), 0)

  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
  const weekRes = reservations.filter((r) => new Date(r.date) >= thisWeekStart)

  // Popular items from pre-orders
  const itemCounts: Record<string, { name: string; count: number }> = {}
  reservations.forEach((r) => {
    (r.pre_order_items || []).forEach((item) => {
      if (!itemCounts[item.id]) itemCounts[item.id] = { name: item.name, count: 0 }
      itemCounts[item.id].count += item.quantity
    })
  })
  const popularItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5)

  const cards: StatCard[] = [
    {
      label: 'დღევანდელი ჯავშნები',
      value: todayRes.length,
      sub: `${todayRes.filter(r => r.status === 'confirmed').length} დადასტურებული`,
      icon: <Calendar size={20} />,
      color: 'text-gold',
    },
    {
      label: 'მოლოდინში',
      value: pending.length,
      sub: 'საჭიროებს დადასტურებას',
      icon: <Clock size={20} />,
      color: 'text-yellow-400',
    },
    {
      label: 'კვირის ჯავშნები',
      value: weekRes.length,
      sub: `${confirmed.length} სულ დადასტურებული`,
      icon: <Users size={20} />,
      color: 'text-green-400',
    },
    {
      label: 'Takeout შემოსავალი',
      value: `₾${takeoutRevenue.toFixed(0)}`,
      sub: `${takeouts.length} შეკვეთა სულ`,
      icon: <Package size={20} />,
      color: 'text-blue-400',
    },
    {
      label: 'სულ ჯავშნები',
      value: reservations.length,
      sub: `${reservations.filter(r => r.order_type === 'dine-in').length} მაგიდა · ${takeouts.length} წასაღები`,
      icon: <TrendingUp size={20} />,
      color: 'text-gold',
    },
  ]

  if (loading) {
    return <div className="text-cream/40 text-sm animate-pulse py-8 text-center">იტვირთება...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={load} className="flex items-center gap-1.5 text-cream/30 hover:text-cream/60 text-xs transition-colors">
          <RefreshCw size={13} /> განახლება
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-dark-border bg-dark-card/30 p-5">
            <div className={`mb-3 ${c.color}`}>{c.icon}</div>
            <div className="text-2xl font-serif text-cream mb-1">{c.value}</div>
            <div className="text-xs text-gold/60 uppercase tracking-wider">{c.label}</div>
            {c.sub && <div className="text-xs text-cream/30 mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Popular items */}
      {popularItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed size={15} className="text-gold/60" />
            <h3 className="text-xs uppercase tracking-widest text-gold/60">პოპულარული კერძები (შეკვეთებიდან)</h3>
          </div>
          <div className="border border-dark-border">
            {popularItems.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between px-4 py-3 border-b border-dark-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-gold/40 text-xs w-4">{i + 1}</span>
                  <span className="text-cream/80 text-sm">{item.name}</span>
                </div>
                <span className="text-gold font-serif">{item.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-gold/60" />
          <h3 className="text-xs uppercase tracking-widest text-gold/60">სტატუსის განაწილება</h3>
        </div>
        <div className="border border-dark-border">
          {[
            { label: 'მოლოდინი', value: pending.length, color: 'bg-yellow-400' },
            { label: 'დადასტურებული', value: confirmed.length, color: 'bg-green-400' },
            { label: 'გაუქმებული', value: reservations.filter(r => r.status === 'cancelled').length, color: 'bg-red-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-4 py-3 border-b border-dark-border/50 last:border-0">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-cream/60 text-sm flex-1">{s.label}</span>
              <span className="text-cream font-medium">{s.value}</span>
              <span className="text-cream/30 text-xs w-10 text-right">
                {reservations.length ? Math.round((s.value / reservations.length) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
