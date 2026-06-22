'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit3, Save, X, ImagePlus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import SaveBar from './SaveBar'
import { supabase } from '@/lib/supabase'

type MenuItem = {
  id: string
  name: string
  nameIt: string
  description: string
  price: number
  badge: string | null
  image_url?: string
}
type Category = { id: string; name: string; nameIt: string; items: MenuItem[] }
type Props = { data: Category[]; onSave: (d: Category[]) => Promise<void> }

const badgeMap: Record<string, string> = { popular: 'პოპულარული', chef: 'შეფის რჩეული' }

function ItemEditor({ item, onSave, onCancel }: { item: Partial<MenuItem>; onSave: (i: MenuItem) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<MenuItem>>(item)
  const [uploading, setUploading] = useState(false)

  const set = (k: keyof MenuItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: k === 'price' ? Number(e.target.value) : e.target.value }))

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const itemId = form.id || `item-${Date.now()}`
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${itemId}.${ext}`
    const { error } = await supabase.storage.from('menu-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(path)
      setForm((p) => ({ ...p, image_url: publicUrl, id: itemId }))
    }
    setUploading(false)
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    onSave({
      id: form.id || Date.now().toString(),
      name: form.name!,
      nameIt: form.nameIt || '',
      description: form.description || '',
      price: form.price!,
      badge: (form.badge as string) || null,
      image_url: form.image_url,
    })
  }

  return (
    <div className="bg-dark border border-gold/30 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input value={form.name || ''} onChange={set('name')} placeholder="სახელი (ქართ.)" className="input-field text-xs py-1.5" />
        <input value={form.nameIt || ''} onChange={set('nameIt')} placeholder="Nome italiano" className="input-field text-xs py-1.5" />
      </div>
      <textarea value={form.description || ''} onChange={set('description')} placeholder="აღწერა" rows={2} className="input-field text-xs py-1.5 resize-none w-full" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" value={form.price || ''} onChange={set('price')} placeholder="ფასი ₾" className="input-field text-xs py-1.5" />
        <select value={form.badge || ''} onChange={set('badge')} className="input-field text-xs py-1.5 bg-dark-card">
          <option value="">ბეიჯი არ არის</option>
          <option value="popular">პოპულარული</option>
          <option value="chef">შეფის რჩეული</option>
        </select>
      </div>

      {/* Image upload */}
      <div className="flex items-center gap-3">
        {form.image_url && (
          <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-dark-border">
            <Image src={form.image_url} alt="preview" fill className="object-cover" />
          </div>
        )}
        <label className={`flex items-center gap-2 px-3 py-1.5 border border-dark-border text-xs text-cream/50 hover:border-gold/40 hover:text-gold cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
          {uploading ? 'იტვირთება...' : form.image_url ? 'ფოტოს შეცვლა' : 'ფოტოს ატვირთვა'}
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
        {form.image_url && (
          <button type="button" onClick={() => setForm((p) => ({ ...p, image_url: undefined }))}
            className="text-cream/30 hover:text-red-400 text-xs transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={handleSave} className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5">
          <Save size={12} /> შენახვა
        </button>
        <button type="button" onClick={onCancel} className="btn-outline text-xs py-1.5 px-4 flex items-center gap-1.5">
          <X size={12} /> გაუქმება
        </button>
      </div>
    </div>
  )
}

export default function TabMenu({ data, onSave }: Props) {
  const [categories, setCategories] = useState<Category[]>(data)
  const [editing, setEditing] = useState<{ catId: string; item: Partial<MenuItem> } | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const addItem = (catId: string, item: MenuItem) => {
    setCategories((cats) => cats.map((c) =>
      c.id === catId
        ? { ...c, items: editing?.item.id ? c.items.map((i) => i.id === item.id ? item : i) : [...c.items, item] }
        : c
    ))
    setEditing(null)
  }

  const deleteItem = (catId: string, itemId: string) => {
    if (!confirm('წაიშალოს?')) return
    setCategories((cats) => cats.map((c) =>
      c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
    ))
  }

  const save = async () => {
    setStatus('saving')
    try { await onSave(categories); setStatus('saved'); setTimeout(() => setStatus('idle'), 3000) }
    catch { setStatus('error') }
  }

  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-gold font-serif text-lg">{cat.name}</h3>
            <span className="text-cream/30 text-xs italic">{cat.nameIt}</span>
            <div className="flex-1 h-px bg-dark-border" />
            <button type="button" onClick={() => setEditing({ catId: cat.id, item: {} })}
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Plus size={13} /> კერძი
            </button>
          </div>

          <div className="space-y-1.5">
            {cat.items.map((item) => (
              <div key={item.id}>
                {editing?.catId === cat.id && editing.item.id === item.id ? (
                  <ItemEditor item={editing.item} onSave={(u) => addItem(cat.id, u)} onCancel={() => setEditing(null)} />
                ) : (
                  <div className="card-dark flex items-center gap-3 px-3 py-2.5">
                    {item.image_url && (
                      <div className="relative w-12 h-10 shrink-0 overflow-hidden">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-cream text-sm">{item.name}</span>
                      <span className="text-cream/30 text-xs ml-2 italic">{item.nameIt}</span>
                      {item.badge && <span className="text-gold/50 text-xs ml-2">[{badgeMap[item.badge] || item.badge}]</span>}
                      <p className="text-cream/40 text-xs truncate">{item.description}</p>
                    </div>
                    <span className="text-gold text-sm shrink-0">₾{item.price}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button type="button" onClick={() => setEditing({ catId: cat.id, item: item })}
                        className="text-cream/30 hover:text-gold p-1 transition-colors"><Edit3 size={14} /></button>
                      <button type="button" onClick={() => deleteItem(cat.id, item.id)}
                        className="text-cream/30 hover:text-red-400 p-1 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editing?.catId === cat.id && !editing.item.id && (
              <ItemEditor item={{}} onSave={(item) => addItem(cat.id, item)} onCancel={() => setEditing(null)} />
            )}
          </div>
        </div>
      ))}
      <SaveBar onSave={save} status={status} />
    </div>
  )
}
