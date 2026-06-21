'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import menuData from '@/data/menu.json'

export type CartItem = {
  id: string
  name: string
  nameIt: string
  price: number
  quantity: number
}

type MenuItem = {
  id: string
  name: string
  nameIt: string
  description: string
  price: number
  badge: string | null
  image_url?: string
}

type Category = {
  id: string
  name: string
  nameIt: string
  items: MenuItem[]
}

interface OrderMenuProps {
  cart: CartItem[]
  onCartChange: (cart: CartItem[]) => void
  totalLabel: string
  emptyLabel: string
}

export default function OrderMenu({ cart, onCartChange, totalLabel, emptyLabel }: OrderMenuProps) {
  const [categories, setCategories] = useState<Category[]>(menuData.categories as Category[])
  const [activeCategory, setActiveCategory] = useState<string>(
    (menuData.categories as Category[])[0]?.id || ''
  )

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('menu_categories')
        .select('id, name, name_it, sort_order, menu_items(id, name, name_it, description, price, badge, image_url, sort_order)')
        .order('sort_order')

      if (data && data.length > 0) {
        const cats: Category[] = data.map((cat: {
          id: string; name: string; name_it: string
          menu_items: { id: string; name: string; name_it: string; description: string; price: number; badge: string | null; image_url?: string; sort_order: number }[]
        }) => ({
          id: cat.id,
          name: cat.name,
          nameIt: cat.name_it,
          items: (cat.menu_items || [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => ({
              id: item.id,
              name: item.name,
              nameIt: item.name_it,
              description: item.description,
              price: item.price,
              badge: item.badge,
              image_url: item.image_url,
            })),
        }))
        setCategories(cats)
        setActiveCategory(cats[0]?.id || '')
      }
    }
    load()
  }, [])

  function getQty(id: string) {
    return cart.find((i) => i.id === id)?.quantity || 0
  }

  function update(item: MenuItem, delta: number) {
    const existing = cart.find((i) => i.id === item.id)
    if (!existing) {
      if (delta > 0) {
        onCartChange([...cart, { id: item.id, name: item.name, nameIt: item.nameIt, price: item.price, quantity: 1 }])
      }
    } else {
      const newQty = existing.quantity + delta
      if (newQty <= 0) {
        onCartChange(cart.filter((i) => i.id !== item.id))
      } else {
        onCartChange(cart.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)))
      }
    }
  }

  const activeItems = categories.find((c) => c.id === activeCategory)?.items || []
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-1.5 text-xs tracking-wider border transition-colors ${
              activeCategory === cat.id
                ? 'border-gold text-gold bg-gold/10'
                : 'border-dark-border text-cream/40 hover:text-cream/70 hover:border-gold/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-0 border border-dark-border">
        {activeItems.map((item) => {
          const qty = getQty(item.id)
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-dark-border/50 last:border-0 transition-colors ${
                qty > 0 ? 'bg-gold/5' : ''
              }`}
            >
              {item.image_url && (
                <div className="relative w-12 h-10 shrink-0 overflow-hidden">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-cream text-sm font-medium">{item.name}</div>
                <div className="text-cream/40 text-xs italic">{item.nameIt}</div>
              </div>
              <div className="text-gold font-serif text-sm shrink-0">₾{item.price}</div>
              <div className="flex items-center gap-1.5 shrink-0">
                {qty > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => update(item, -1)}
                      className="w-7 h-7 border border-dark-border text-cream/60 hover:border-gold/50 hover:text-gold flex items-center justify-center transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-cream text-sm w-5 text-center font-medium">{qty}</span>
                    <button
                      type="button"
                      onClick={() => update(item, 1)}
                      className="w-7 h-7 border border-gold/50 text-gold bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => update(item, 1)}
                    className="w-7 h-7 border border-dark-border text-cream/30 hover:border-gold/40 hover:text-gold flex items-center justify-center transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart summary */}
      {count > 0 ? (
        <div className="bg-gold/10 border border-gold/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold">
            <ShoppingBag size={15} />
            <span className="text-sm font-medium">{count} კერძი</span>
          </div>
          <div className="text-gold font-serif text-lg">{totalLabel}: ₾{total}</div>
        </div>
      ) : (
        <div className="border border-dark-border px-4 py-3 text-cream/30 text-sm text-center">
          {emptyLabel}
        </div>
      )}
    </div>
  )
}
