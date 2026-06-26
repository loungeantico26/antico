'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExternalLink, LayoutDashboard, Lock, Mail, LogOut, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import TabSite from '@/components/admin/TabSite'
import TabHero from '@/components/admin/TabHero'
import TabAbout from '@/components/admin/TabAbout'
import TabGallery from '@/components/admin/TabGallery'
import TabTestimonials from '@/components/admin/TabTestimonials'
import TabContact from '@/components/admin/TabContact'
import TabMenu from '@/components/admin/TabMenu'
import TabReservations from '@/components/admin/TabReservations'
import TabUsers from '@/components/admin/TabUsers'
import TabStats from '@/components/admin/TabStats'
import TabQR from '@/components/admin/TabQR'

type Content = {
  site: { name: string; tagline: string; footerText: string }
  hero: { backgroundUrl: string; badge: string; heading: string; subheading: string; cta1: string; cta2: string }
  about: { badge: string; heading: string; text1: string; text2: string; imageUrl: string; yearsLabel: string; yearsText: string; cta: string }
  features: { icon: string; title: string; desc: string }[]
  cta: { backgroundUrl: string; badge: string; heading: string; text: string; cta: string }
  testimonials: { id: string; name: string; text: string; rating: number }[]
  gallery: { id: string; src: string; alt: string }[]
  contact: { address: string; phone1: string; phone2: string; email1: string; email2: string; weekdays: string; weekends: string; mapUrl: string; footerAddress: string }
}

type MenuData = {
  categories: { id: string; name: string; nameIt: string; items: { id: string; name: string; nameIt: string; description: string; price: number; badge: string | null; image_url?: string }[] }[]
}

type AdminState = 'loading' | 'login' | 'no-access' | 'dashboard'

const TABS = [
  { id: 'stats', label: '📊 სტატისტიკა' },
  { id: 'reservations', label: 'ჯავშნები' },
  { id: 'users', label: 'მომხმარებლები' },
  { id: 'menu', label: 'მენიუ' },
  { id: 'qr', label: 'QR კოდი' },
  { id: 'testimonials', label: 'შეფასებები' },
  { id: 'gallery', label: 'გალერეა' },
  { id: 'site', label: 'საიტი' },
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'კონტაქტი' },
]

async function fetchContent(): Promise<Content> {
  const [contentRes, galleryRes, testimonialsRes] = await Promise.all([
    supabase.from('site_content').select('key, value'),
    supabase.from('gallery_photos').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
  ])

  const map: Record<string, unknown> = {}
  ;(contentRes.data || []).forEach((row: { key: string; value: unknown }) => { map[row.key] = row.value })

  const fallback = await fetch('/data/content.json').then((r) => r.json()).catch(() => ({}))

  const sbHero = map.hero as Content['hero']
  const sbAbout = map.about as Content['about']

  // Use JSON if Supabase has stale data (old Unsplash URLs or old Italian/2015 references)
  const hero = (sbHero?.backgroundUrl?.includes('unsplash') || !sbHero) ? fallback.hero : sbHero
  const about = (sbAbout?.text1?.includes('2015') || sbAbout?.text1?.includes('იტალიური') || !sbAbout) ? fallback.about : sbAbout

  return {
    site: (map.site as Content['site']) || fallback.site || { name: 'Lounge Antico', tagline: '', footerText: '' },
    hero: hero || {},
    about: about || {},
    features: (map.features as Content['features']) || fallback.features || [],
    cta: (map.cta as Content['cta']) || fallback.cta || {},
    testimonials: (testimonialsRes.data as Content['testimonials']) || fallback.testimonials || [],
    gallery: (galleryRes.data as Content['gallery']) || fallback.gallery || [],
    contact: (map.contact as Content['contact']) || fallback.contact || {},
  }
}

async function fetchMenu(): Promise<MenuData> {
  const [{ data: cats }, jsonMenu] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('id, name, name_it, sort_order, menu_items(id, name, name_it, description, price, badge, image_url, sort_order, category_id)')
      .order('sort_order'),
    fetch('/data/menu.json').then((r) => r.json()).catch(() => ({ categories: [] })),
  ])

  const jsonCount: number = (jsonMenu.categories || []).length

  if (cats && cats.length >= jsonCount) {
    return {
      categories: cats.map((cat: { id: string; name: string; name_it: string; menu_items: { id: string; name: string; name_it: string; description: string; price: number; badge: string | null; image_url?: string; sort_order: number }[] }) => ({
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
      })),
    }
  }

  return jsonMenu
}

export default function AdminPage() {
  const [state, setState] = useState<AdminState>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [activeTab, setActiveTab] = useState('stats')
  const [content, setContent] = useState<Content | null>(null)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [saveMsg, setSaveMsg] = useState('')

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setState('login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile && (profile.role === 'owner' || profile.role === 'admin')) {
      setUserRole(profile.role)
      setState('dashboard')
      const [c, m] = await Promise.all([fetchContent(), fetchMenu()])
      setContent(c)
      setMenuData(m)
    } else {
      setState('no-access')
    }
  }, [])

  useEffect(() => { checkAuth() }, [checkAuth])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError('ელ. ფოსტა ან პაროლი არასწორია.')
      setLoginLoading(false)
    } else {
      checkAuth()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setState('login')
    setEmail('')
    setPassword('')
  }

  function showSaved(msg = 'შენახულია ✓') {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const saveContent = useCallback(async (patch: Partial<Content>) => {
    if (!content) return
    const updated = { ...content, ...patch } as Content
    setContent(updated)

    for (const [key, value] of Object.entries(patch)) {
      if (key === 'gallery') {
        const photos = value as Content['gallery']
        await supabase.from('gallery_photos').delete().neq('id', '')
        if (photos.length > 0) {
          await supabase.from('gallery_photos').insert(
            photos.map((p, i) => ({ id: p.id, src: p.src, alt: p.alt, sort_order: i }))
          )
        }
      } else if (key === 'testimonials') {
        const tests = value as Content['testimonials']
        await supabase.from('testimonials').delete().neq('id', '')
        if (tests.length > 0) {
          await supabase.from('testimonials').insert(
            tests.map((t, i) => ({ id: t.id, name: t.name, text: t.text, rating: t.rating, sort_order: i }))
          )
        }
      } else {
        await supabase.from('site_content').upsert({ key, value })
      }
    }
    showSaved()
  }, [content])

  const saveMenu = useCallback(async (categories: MenuData['categories']) => {
    setMenuData({ categories })

    for (const cat of categories) {
      await supabase.from('menu_categories').upsert({
        id: cat.id, name: cat.name, name_it: cat.nameIt, sort_order: categories.indexOf(cat),
      })
      await supabase.from('menu_items').delete().eq('category_id', cat.id)
      if (cat.items.length > 0) {
        await supabase.from('menu_items').insert(
          cat.items.map((item, i) => ({
            id: item.id,
            category_id: cat.id,
            name: item.name,
            name_it: item.nameIt,
            description: item.description,
            price: item.price,
            badge: item.badge,
            image_url: item.image_url || null,
            sort_order: i,
          }))
        )
      }
    }
    showSaved()
  }, [])

  // ── Loading ──
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-cream/30 text-sm animate-pulse">იტვირთება...</div>
      </div>
    )
  }

  // ── Login ──
  if (state === 'login') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <LayoutDashboard size={36} className="text-gold mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-cream mb-1">Admin Panel</h1>
            <p className="text-cream/30 text-sm">Lounge Antico</p>
          </div>
          <form onSubmit={handleLogin} className="card-dark p-8 space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ელ. ფოსტა"
                required
                className="input-field pl-11"
              />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="პაროლი"
                required
                className="input-field pl-11"
              />
            </div>
            {loginError && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-xs">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loginLoading ? 'მიმდინარეობს...' : 'შესვლა'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── No Access ──
  if (state === 'no-access') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6 text-center">
        <div>
          <Shield size={40} className="text-red-400/60 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-cream mb-2">წვდომა შეზღუდულია</h2>
          <p className="text-cream/40 text-sm mb-6">თქვენ არ გაქვთ ადმინის უფლებები.</p>
          <button onClick={handleLogout} className="btn-outline text-sm py-2 px-6">გასვლა</button>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-border h-14 flex items-center px-5 gap-4">
        <LayoutDashboard size={17} className="text-gold" />
        <span className="font-serif text-gold tracking-wider">Admin</span>
        {userRole === 'owner' && (
          <span className="text-xs bg-gold/10 text-gold border border-gold/30 px-2 py-0.5">OWNER</span>
        )}
        {saveMsg && (
          <span className="text-green-400 text-xs ml-2 animate-pulse">{saveMsg}</span>
        )}
        <div className="flex-1" />
        <a
          href="/ka"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cream/30 hover:text-cream/60 text-xs transition-colors"
        >
          <ExternalLink size={13} /> საიტი
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-cream/30 hover:text-cream/60 text-xs transition-colors"
        >
          <LogOut size={13} /> გასვლა
        </button>
      </div>

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar */}
        <aside className="w-44 shrink-0 fixed left-0 top-14 bottom-0 bg-dark-card border-r border-dark-border overflow-y-auto">
          <nav className="p-2 space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-gold/10 text-gold border-l-2 border-gold'
                    : 'text-cream/50 hover:text-cream/80 hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-44 p-8 max-w-3xl">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-cream">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <div className="w-8 h-px bg-gold mt-2" />
          </div>

          {activeTab === 'stats' && <TabStats />}
          {activeTab === 'reservations' && <TabReservations />}
          {activeTab === 'users' && <TabUsers currentUserRole={userRole} />}
          {activeTab === 'qr' && <TabQR />}

          {content && menuData && (
            <>
              {activeTab === 'site' && <TabSite data={content.site} onSave={(site) => saveContent({ site })} />}
              {activeTab === 'hero' && <TabHero data={content.hero} onSave={(hero) => saveContent({ hero })} />}
              {activeTab === 'about' && (
                <TabAbout about={content.about} cta={content.cta} onSave={(about, cta) => saveContent({ about, cta })} />
              )}
              {activeTab === 'gallery' && (
                <TabGallery data={content.gallery} onSave={(gallery) => saveContent({ gallery })} />
              )}
              {activeTab === 'menu' && <TabMenu data={menuData.categories} onSave={saveMenu} />}
              {activeTab === 'testimonials' && (
                <TabTestimonials data={content.testimonials} onSave={(testimonials) => saveContent({ testimonials })} />
              )}
              {activeTab === 'contact' && (
                <TabContact data={content.contact} onSave={(contact) => saveContent({ contact })} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
