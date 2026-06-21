'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExternalLink, LayoutDashboard, AlertCircle } from 'lucide-react'
import TabSite from '@/components/admin/TabSite'
import TabHero from '@/components/admin/TabHero'
import TabAbout from '@/components/admin/TabAbout'
import TabGallery from '@/components/admin/TabGallery'
import TabTestimonials from '@/components/admin/TabTestimonials'
import TabContact from '@/components/admin/TabContact'
import TabMenu from '@/components/admin/TabMenu'

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
  categories: { id: string; name: string; nameIt: string; items: { id: string; name: string; nameIt: string; description: string; price: number; badge: string | null }[] }[]
}

const TABS = [
  { id: 'site', label: 'საიტი' },
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'გალერეა' },
  { id: 'menu', label: 'მენიუ' },
  { id: 'testimonials', label: 'შეფასებები' },
  { id: 'contact', label: 'კონტაქტი' },
]

export default function AdminPage() {
  const [content, setContent] = useState<Content | null>(null)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [activeTab, setActiveTab] = useState('site')

  useEffect(() => {
    fetch('/data/content.json').then((r) => r.json()).then(setContent).catch(console.error)
    fetch('/data/menu.json').then((r) => r.json()).then(setMenuData).catch(console.error)
  }, [])

  const saveContent = useCallback(async (patch: Partial<Content>) => {
    alert('ცვლილებების შესანახად სერვერი საჭიროა.\nGitHub-ზე data/content.json ფაილი შეცვალეთ ხელით.')
    const updated = { ...content, ...patch } as Content
    setContent(updated)
  }, [content])

  const saveMenu = useCallback(async (categories: MenuData['categories']) => {
    alert('ცვლილებების შესანახად სერვერი საჭიროა.\nGitHub-ზე data/menu.json ფაილი შეცვალეთ ხელით.')
    const updated = { ...menuData, categories } as MenuData
    setMenuData(updated)
  }, [menuData])

  if (!content || !menuData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-cream/40 text-sm animate-pulse">იტვირთება...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark">
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-border h-16 flex items-center px-6 gap-4">
        <LayoutDashboard size={18} className="text-gold" />
        <span className="font-serif text-gold text-lg tracking-wider">Admin Panel</span>
        <div className="flex-1" />
        <a href="/ka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-cream/40 hover:text-cream/70 text-xs transition-colors">
          <ExternalLink size={13} /> საიტი
        </a>
      </div>

      {/* Server required banner */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gold/10 border-b border-gold/30 px-6 py-2 flex items-center gap-2">
        <AlertCircle size={14} className="text-gold shrink-0" />
        <p className="text-gold/80 text-xs">სერვერის გარეშე ცვლილებები არ ინახება. კონტენტის შეცვლა: GitHub → data/content.json</p>
      </div>

      <div className="flex pt-28 min-h-screen">
        <aside className="w-48 shrink-0 fixed left-0 top-28 bottom-0 bg-dark-card border-r border-dark-border overflow-y-auto">
          <nav className="p-3 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
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

        <main className="flex-1 ml-48 p-8 max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-cream">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <div className="w-10 h-px bg-gold mt-2" />
          </div>

          {activeTab === 'site' && <TabSite data={content.site} onSave={(site) => saveContent({ site })} />}
          {activeTab === 'hero' && <TabHero data={content.hero} onSave={(hero) => saveContent({ hero })} />}
          {activeTab === 'about' && (
            <TabAbout about={content.about} cta={content.cta} onSave={(about, cta) => saveContent({ about, cta })} />
          )}
          {activeTab === 'gallery' && <TabGallery data={content.gallery} onSave={(gallery) => saveContent({ gallery })} />}
          {activeTab === 'menu' && <TabMenu data={menuData.categories} onSave={saveMenu} />}
          {activeTab === 'testimonials' && (
            <TabTestimonials data={content.testimonials} onSave={(testimonials) => saveContent({ testimonials })} />
          )}
          {activeTab === 'contact' && <TabContact data={content.contact} onSave={(contact) => saveContent({ contact })} />}
        </main>
      </div>
    </div>
  )
}
