'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Save, X, Lock } from 'lucide-react'

type MenuItem = {
  id: string
  name: string
  nameIt: string
  description: string
  price: number
  badge: string | null
}

type Category = {
  id: string
  name: string
  nameIt: string
  items: MenuItem[]
}

type MenuData = {
  categories: Category[]
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_auth', password)
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card-dark p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Lock size={32} className="text-gold mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-cream">Admin Panel</h1>
          <div className="gold-divider mt-4" />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="პაროლი"
            className="input-field"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">არასწორი პაროლი</p>}
          <button type="submit" className="btn-primary w-full text-center">
            შესვლა
          </button>
        </form>
      </div>
    </div>
  )
}

function ItemEditor({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<MenuItem>
  onSave: (item: MenuItem) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<MenuItem>>(item)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.name === 'price' ? Number(e.target.value) : e.target.value
    setForm((p) => ({ ...p, [e.target.name]: val }))
  }

  const save = () => {
    if (!form.name || !form.price) return
    onSave({
      id: form.id || Date.now().toString(),
      name: form.name!,
      nameIt: form.nameIt || '',
      description: form.description || '',
      price: form.price!,
      badge: form.badge || null,
    })
  }

  return (
    <div className="card-dark p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" value={form.name || ''} onChange={handle} placeholder="სახელი (ქართ.)" className="input-field text-sm py-2" />
        <input name="nameIt" value={form.nameIt || ''} onChange={handle} placeholder="Nome (italiano)" className="input-field text-sm py-2" />
      </div>
      <textarea name="description" value={form.description || ''} onChange={handle} placeholder="აღწერა" rows={2} className="input-field text-sm py-2 resize-none w-full" />
      <div className="grid grid-cols-2 gap-3">
        <input name="price" type="number" value={form.price || ''} onChange={handle} placeholder="ფასი (₾)" className="input-field text-sm py-2" />
        <select name="badge" value={form.badge || ''} onChange={handle} className="input-field text-sm py-2 bg-dark-card">
          <option value="">ბეიჯი არ არის</option>
          <option value="popular">პოპულარული</option>
          <option value="chef">შეფის რჩეული</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <Save size={14} /> შენახვა
        </button>
        <button onClick={onCancel} className="btn-outline text-xs py-2 px-4 flex items-center gap-2">
          <X size={14} /> გაუქმება
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [editingItem, setEditingItem] = useState<{ catId: string; item: Partial<MenuItem> } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth')
    if (stored) {
      fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: stored }),
      }).then((r) => { if (r.ok) setAuthed(true) })
    }
  }, [])

  useEffect(() => {
    if (authed) {
      fetch('/api/menu').then((r) => r.json()).then(setMenuData)
    }
  }, [authed])

  const saveMenu = async (data: MenuData) => {
    setSaving(true)
    setSaveMsg('')
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': sessionStorage.getItem('admin_auth') || '',
      },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaveMsg(res.ok ? 'შენახულია!' : 'შეცდომა!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const addItem = (catId: string, item: MenuItem) => {
    if (!menuData) return
    const updated = {
      ...menuData,
      categories: menuData.categories.map((c) =>
        c.id === catId ? { ...c, items: editingItem?.item.id ? c.items.map((i) => i.id === item.id ? item : i) : [...c.items, item] } : c
      ),
    }
    setMenuData(updated)
    setEditingItem(null)
    saveMenu(updated)
  }

  const deleteItem = (catId: string, itemId: string) => {
    if (!menuData || !confirm('წაიშალოს?')) return
    const updated = {
      ...menuData,
      categories: menuData.categories.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      ),
    }
    setMenuData(updated)
    saveMenu(updated)
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />
  if (!menuData) return <div className="min-h-screen flex items-center justify-center text-cream/50">იტვირთება...</div>

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif text-cream">Admin Panel</h1>
            <p className="text-cream/40 text-sm mt-1">მენიუს მართვა</p>
          </div>
          {saveMsg && (
            <div className={`text-sm px-4 py-2 border ${saveMsg.includes('!') && !saveMsg.includes('შეც') ? 'text-green-400 border-green-800' : 'text-red-400 border-red-800'}`}>
              {saveMsg}
            </div>
          )}
        </div>

        {menuData.categories.map((cat) => (
          <div key={cat.id} className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-serif text-gold">{cat.name}</h2>
              <span className="text-cream/30 text-sm italic">{cat.nameIt}</span>
              <div className="flex-1 h-px bg-dark-border" />
              <button
                onClick={() => setEditingItem({ catId: cat.id, item: {} })}
                className="btn-outline text-xs py-1.5 px-4 flex items-center gap-2"
              >
                <Plus size={14} /> კერძის დამატება
              </button>
            </div>

            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item.id}>
                  {editingItem?.catId === cat.id && editingItem.item.id === item.id ? (
                    <ItemEditor
                      item={editingItem.item}
                      onSave={(updated) => addItem(cat.id, updated)}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <div className="card-dark flex items-center justify-between px-4 py-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-cream text-sm font-medium">{item.name}</span>
                        <span className="text-cream/30 text-xs ml-2 italic">{item.nameIt}</span>
                        {item.badge && (
                          <span className="ml-2 text-xs text-gold/60">[{item.badge}]</span>
                        )}
                        <p className="text-cream/40 text-xs truncate">{item.description}</p>
                      </div>
                      <div className="text-gold font-serif shrink-0">₾{item.price}</div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingItem({ catId: cat.id, item: item })}
                          className="text-cream/40 hover:text-gold p-1 transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => deleteItem(cat.id, item.id)}
                          className="text-cream/40 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {editingItem?.catId === cat.id && !editingItem.item.id && (
                <ItemEditor
                  item={editingItem.item}
                  onSave={(newItem) => addItem(cat.id, newItem)}
                  onCancel={() => setEditingItem(null)}
                />
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
          className="text-cream/30 hover:text-cream/60 text-sm transition-colors mt-8"
        >
          გამოსვლა
        </button>
      </div>
    </div>
  )
}
