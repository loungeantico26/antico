import { Star } from 'lucide-react'
import menuData from '@/data/menu.json'

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

const badgeMap: Record<string, { label: string; class: string }> = {
  popular: { label: 'პოპულარული', class: 'bg-gold/20 text-gold border-gold/40' },
  chef: { label: 'შეფის რჩეული', class: 'bg-cream/10 text-cream border-cream/30' },
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex justify-between items-start gap-4 py-6 border-b border-dark-border/50 group">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-serif text-cream text-lg group-hover:text-gold transition-colors duration-200">
            {item.name}
          </h3>
          {item.badge && (
            <span className={`text-xs px-2 py-0.5 border rounded-none tracking-wider ${badgeMap[item.badge].class}`}>
              {badgeMap[item.badge].label}
            </span>
          )}
        </div>
        <div className="text-gold/60 text-xs tracking-wider italic mb-2">{item.nameIt}</div>
        <p className="text-cream/50 text-sm leading-relaxed">{item.description}</p>
      </div>
      <div className="text-gold font-serif text-xl shrink-0 mt-1">
        ₾{item.price}
      </div>
    </div>
  )
}

export default function MenuPage() {
  const categories = menuData.categories as Category[]

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">Antico Restaurant</p>
        <h1 className="section-title">ჩვენი მენიუ</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm leading-relaxed">
          ყველა კერძი მზადდება ახალი, სეზონური ინგრედიენტებით. ფასები ლარშია.
        </p>
      </section>

      {/* Menu categories */}
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
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Allergen note */}
      <section className="py-10 px-6 bg-dark-card border-t border-dark-border">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <Star size={16} className="text-gold mt-0.5 shrink-0" />
          <p className="text-cream/40 text-xs leading-relaxed">
            ალერგენების შესახებ ინფორმაციისთვის გთხოვთ მიმართოთ ჩვენს პერსონალს.
            ჩვენ ვუზრუნველყოფთ ვეგეტარიანულ და ვეგანურ ვარიანტებს მოთხოვნის შემთხვევაში.
          </p>
        </div>
      </section>
    </>
  )
}
