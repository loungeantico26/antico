import Link from 'next/link'
import menuData from '@/data/menu.json'

export default function MenuPreview() {
  const featured = menuData.categories
    .flatMap((c) => c.items)
    .filter((i) => i.badge === 'chef')
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featured.map((item) => (
        <div key={item.id} className="card-dark p-6 group hover:border-gold/40 transition-colors duration-300">
          <div className="text-xs tracking-[0.3em] text-gold/60 italic mb-2">{item.nameIt}</div>
          <h3 className="font-serif text-cream text-xl mb-2 group-hover:text-gold transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-cream/50 text-sm leading-relaxed mb-4">{item.description}</p>
          <div className="text-gold font-serif text-2xl">₾{item.price}</div>
        </div>
      ))}
    </div>
  )
}
