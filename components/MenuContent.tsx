'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import menuData from '@/data/menu.json'

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

function MenuItemCard({ item, popularLabel, chefLabel }: { item: MenuItem; popularLabel: string; chefLabel: string }) {
  const badgeMap: Record<string, { label: string; class: string }> = {
    popular: { label: popularLabel, class: 'bg-gold/20 text-gold border-gold/40' },
    chef: { label: chefLabel, class: 'bg-cream/10 text-cream border-cream/30' },
  }

  return (
    <div className="flex items-start gap-5 py-6 border-b border-dark-border/50 group">
      {item.image_url && (
        <div className="relative w-24 h-20 shrink-0 overflow-hidden">
          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-serif text-cream text-lg group-hover:text-gold transition-colors duration-200">
            {item.name}
          </h3>
          {item.badge && badgeMap[item.badge] && (
            <span className={`text-xs px-2 py-0.5 border rounded-none tracking-wider ${badgeMap[item.badge].class}`}>
              {badgeMap[item.badge].label}
            </span>
          )}
        </div>
        <div className="text-gold/60 text-xs tracking-wider italic mb-2">{item.nameIt}</div>
        <p className="text-cream/50 text-sm leading-relaxed">{item.description}</p>
      </div>
      <div className="text-gold font-serif text-xl shrink-0 mt-1">₾{item.price}</div>
    </div>
  )
}

export default function MenuContent() {
  const t = useTranslations('menu')
  const [categories, setCategories] = useState<Category[]>(menuData.categories as Category[])

  useEffect(() => {
    async function loadFromSupabase() {
      const { data: cats } = await supabase
        .from('menu_categories')
        .select('id, name, name_it, sort_order, menu_items(id, name, name_it, description, price, badge, image_url, sort_order)')
        .order('sort_order')

      if (cats && cats.length > 0) {
        setCategories(
          cats.map((cat: { id: string; name: string; name_it: string; menu_items: { id: string; name: string; name_it: string; description: string; price: number; badge: string | null; image_url?: string; sort_order: number }[] }) => ({
            id: cat.id,
            name: cat.name,
            nameIt: cat.name_it,
            items: (cat.menu_items || [])
              .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
              .map((item: { id: string; name: string; name_it: string; description: string; price: number; badge: string | null; image_url?: string }) => ({
                id: item.id,
                name: item.name,
                nameIt: item.name_it,
                description: item.description,
                price: item.price,
                badge: item.badge,
                image_url: item.image_url,
              })),
          }))
        )
      }
    }
    loadFromSupabase()
  }, [])

  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">{t('badge')}</p>
        <h1 className="section-title">{t('title')}</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm leading-relaxed">{t('subtitle')}</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <div className="section-subtitle mb-1">{cat.nameIt}</div>
                  <h2 className="text-3xl font-serif text-cream">{cat.name}</h2>
                </div>
                <div className="flex-1 h-px bg-dark-border" />
              </div>
              <div>
                {cat.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} popularLabel={t('popular')} chefLabel={t('chef')} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-6 bg-dark-card border-t border-dark-border">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <Star size={16} className="text-gold mt-0.5 shrink-0" />
          <p className="text-cream/40 text-xs leading-relaxed">{t('allergen')}</p>
        </div>
      </section>
    </>
  )
}
