'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, RefreshCw, UtensilsCrossed, Package, Trash2 } from 'lucide-react'

type OrderItem = { id: string; name: string; price: number; quantity: number }

type Reservation = {
  id: string
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  message: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  order_type: 'dine-in' | 'takeout'
  pre_order_items: OrderItem[]
  pre_order_total: number
}

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled'

const filterLabels: Record<Filter, string> = {
  all: 'ყველა',
  pending: 'მოლოდინი',
  confirmed: 'დადასტურებული',
  cancelled: 'გაუქმებული',
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-green-400',
  cancelled: 'text-red-400/70',
}

export default function TabReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [removingItem, setRemovingItem] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false })
    setReservations(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: 'confirmed' | 'cancelled') {
    setUpdating(id)
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id)
    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      )
    }
    setUpdating(null)
  }

  async function removeItem(reservation: Reservation, itemId: string) {
    if (!confirm('კერძი წაიშალოს და მომხმარებელს ემაილი გაეგზავნოს?')) return
    setRemovingItem(itemId)

    const removedItem = reservation.pre_order_items.find((i) => i.id === itemId)
    const newItems = reservation.pre_order_items.filter((i) => i.id !== itemId)
    const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const { error } = await supabase
      .from('reservations')
      .update({ pre_order_items: newItems, pre_order_total: newTotal })
      .eq('id', reservation.id)

    if (!error) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservation.id
            ? { ...r, pre_order_items: newItems, pre_order_total: newTotal }
            : r
        )
      )

      // მომხმარებელს ემაილი
      if (reservation.email && removedItem) {
        await fetch('https://swtsszumgtgmrobxrmtw.supabase.co/functions/v1/notify-reservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ITEM_REMOVED',
            record: {
              ...reservation,
              pre_order_items: newItems,
              pre_order_total: newTotal,
            },
            removed_item: removedItem,
          }),
        })
      }
    }
    setRemovingItem(null)
  }

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter)
  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  }

  if (loading) {
    return <div className="text-cream/40 text-sm animate-pulse py-8 text-center">იტვირთება...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {(Object.keys(filterLabels) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs tracking-wider border transition-colors ${
              filter === f
                ? 'border-gold text-gold bg-gold/10'
                : 'border-dark-border text-cream/40 hover:text-cream/70 hover:border-gold/30'
            }`}
          >
            {filterLabels[f]}
            <span className="ml-1.5 opacity-60">({counts[f]})</span>
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto flex items-center gap-1.5 text-cream/30 hover:text-cream/60 text-xs transition-colors"
        >
          <RefreshCw size={13} /> განახლება
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-cream/30 text-sm">ჯავშნები ვერ მოიძებნა</div>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="border border-dark-border bg-dark-card/30 p-5 space-y-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-serif text-cream text-lg leading-tight">{r.name}</div>
                <div className="flex flex-wrap gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-cream/50">
                    <Phone size={12} className="text-gold/40" /> {r.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-cream/50">
                    <Mail size={12} className="text-gold/40" /> {r.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {r.order_type === 'takeout' && (
                  <span className="flex items-center gap-1 text-xs border border-cream/20 text-cream/40 px-2 py-0.5">
                    <Package size={10} /> წასაღებად
                  </span>
                )}
                <div className={`text-xs uppercase tracking-widest font-medium ${statusColors[r.status]}`}>
                  {filterLabels[r.status]}
                </div>
              </div>
            </div>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-5 border-t border-dark-border/50 pt-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={13} className="text-gold/40" />
                <span className="text-cream/70">{r.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={13} className="text-gold/40" />
                <span className="text-cream/70">{r.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={13} className="text-gold/40" />
                <span className="text-cream/70">{r.guests} პირი</span>
              </div>
              <div className="text-xs text-cream/20 ml-auto">
                {new Date(r.created_at).toLocaleDateString('ka-GE')}
              </div>
            </div>

            {/* Pre-ordered items */}
            {r.pre_order_items && r.pre_order_items.length > 0 && (
              <div className="border-t border-dark-border/50 pt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gold/60 uppercase tracking-wider mb-2">
                  {r.order_type === 'takeout'
                    ? <><Package size={12} /> წასაღებად შეკვეთა</>
                    : <><UtensilsCrossed size={12} /> წინასწარი შეკვეთა</>
                  }
                </div>
                {r.pre_order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-2">
                    <span className="text-cream/60 flex-1">{item.name} × {item.quantity}</span>
                    <span className="text-gold">₾{item.price * item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(r, item.id)}
                      disabled={removingItem === item.id}
                      title="კერძი არ გვაქვს — წაშლა + ემაილი"
                      className="text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30 ml-1 shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-medium pt-1 border-t border-dark-border/30">
                  <span className="text-cream/50">სულ</span>
                  <span className="text-gold font-serif">₾{r.pre_order_total}</span>
                </div>
              </div>
            )}

            {r.message && (
              <p className="text-cream/40 text-xs border-t border-dark-border/50 pt-2 italic">
                &quot;{r.message}&quot;
              </p>
            )}

            {/* Action buttons */}
            {r.status === 'pending' && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => updateStatus(r.id, 'confirmed')}
                  disabled={updating === r.id}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-green-900/20 border border-green-800/40 text-green-400 text-xs hover:bg-green-900/40 transition-colors disabled:opacity-40"
                >
                  <CheckCircle size={13} /> დადასტურება
                </button>
                <button
                  onClick={() => updateStatus(r.id, 'cancelled')}
                  disabled={updating === r.id}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-red-900/20 border border-red-800/40 text-red-400 text-xs hover:bg-red-900/40 transition-colors disabled:opacity-40"
                >
                  <XCircle size={13} /> გაუქმება
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
