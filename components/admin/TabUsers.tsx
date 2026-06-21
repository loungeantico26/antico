'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Crown, Shield, Star, RefreshCw, Check } from 'lucide-react'

type UserProfile = {
  id: string
  name: string
  email: string
  phone: string
  role: 'owner' | 'admin' | 'customer'
  is_vip: boolean
  discount_percent: number
  created_at: string
}

export default function TabUsers({ currentUserRole }: { currentUserRole: string }) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [discountEdits, setDiscountEdits] = useState<Record<string, number>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    const initial: Record<string, number> = {}
    ;(data || []).forEach((u: UserProfile) => { initial[u.id] = u.discount_percent })
    setDiscountEdits(initial)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function patch(id: string, changes: Partial<UserProfile>) {
    setSaving(id)
    const { error } = await supabase.from('profiles').update(changes).eq('id', id)
    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)))
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    }
    setSaving(null)
  }

  async function saveDiscount(user: UserProfile) {
    const discount = discountEdits[user.id] ?? user.discount_percent
    await patch(user.id, { discount_percent: discount })
  }

  if (loading) {
    return <div className="text-cream/40 text-sm animate-pulse py-8 text-center">იტვირთება...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-cream/30 text-xs">{users.length} მომხმარებელი</span>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-cream/30 hover:text-cream/60 text-xs transition-colors"
        >
          <RefreshCw size={13} /> განახლება
        </button>
      </div>

      {users.map((user) => (
        <div key={user.id} className="border border-dark-border bg-dark-card/30 p-5 space-y-4">
          {/* User header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-cream">{user.name || 'უსახელო'}</span>
                {user.role === 'owner' && <Crown size={14} className="text-gold" />}
                {user.role === 'admin' && <Shield size={14} className="text-gold/70" />}
                {user.is_vip && <Star size={13} className="text-gold fill-gold" />}
              </div>
              <div className="text-cream/50 text-sm">{user.email}</div>
              {user.phone && <div className="text-cream/30 text-xs mt-0.5">{user.phone}</div>}
            </div>
            <div className="text-xs text-cream/20 shrink-0">
              {new Date(user.created_at).toLocaleDateString('ka-GE')}
            </div>
          </div>

          {/* Controls — don't allow editing the owner */}
          {user.role !== 'owner' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-dark-border/50 pt-4">

              {/* VIP toggle */}
              <div>
                <div className="text-xs text-gold/50 uppercase tracking-wider mb-2">VIP სტატუსი</div>
                <button
                  onClick={() => patch(user.id, { is_vip: !user.is_vip })}
                  disabled={saving === user.id}
                  className={`px-4 py-1.5 text-xs border transition-colors disabled:opacity-40 ${
                    user.is_vip
                      ? 'border-gold text-gold bg-gold/10 hover:bg-gold/20'
                      : 'border-dark-border text-cream/40 hover:border-gold/40 hover:text-cream/70'
                  }`}
                >
                  {user.is_vip ? '★ VIP აქტიური' : 'VIP გამოთიშული'}
                </button>
              </div>

              {/* Discount */}
              <div>
                <div className="text-xs text-gold/50 uppercase tracking-wider mb-2">ფასდაკლება %</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={discountEdits[user.id] ?? user.discount_percent}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      setDiscountEdits((prev) => ({ ...prev, [user.id]: Number(e.target.value) }))
                    }
                    className="input-field py-1.5 w-20 text-center text-sm"
                  />
                  <button
                    onClick={() => saveDiscount(user)}
                    disabled={saving === user.id}
                    className="px-3 py-1.5 text-xs border border-dark-border text-cream/50 hover:text-cream hover:border-gold/40 transition-colors disabled:opacity-40"
                  >
                    {saved === user.id ? <Check size={13} className="text-green-400" /> : 'შენახვა'}
                  </button>
                </div>
              </div>

              {/* Role — only owner can promote to admin */}
              {currentUserRole === 'owner' && (
                <div>
                  <div className="text-xs text-gold/50 uppercase tracking-wider mb-2">როლი</div>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      patch(user.id, { role: e.target.value as 'admin' | 'customer' })
                    }
                    disabled={saving === user.id}
                    className="input-field py-1.5 bg-dark-card text-sm disabled:opacity-40"
                  >
                    <option value="customer">მომხმარებელი</option>
                    <option value="admin">ადმინი</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
