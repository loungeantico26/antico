import Image from 'next/image'
import Link from 'next/link'

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    alt: 'რესტორნის ინტერიერი',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    alt: 'სასადილო დარბაზი',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    alt: 'კერძი',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    alt: 'კულინარია',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1551183053-bf91798d738f?w=800&q=80',
    alt: 'პასტა',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    alt: 'პიცა',
    span: 'col-span-2 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=800&q=80',
    alt: 'ბარის კარადა',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    alt: 'ვახშამი',
    span: 'col-span-1 row-span-1',
  },
]

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">Antico Restaurant</p>
        <h1 className="section-title">გალერეა</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">
          ჩვენი ატმოსფერო, კერძები და განუმეორებელი მომენტები.
        </p>
      </section>

      {/* Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden group ${photo.span}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-cream font-serif text-lg">{photo.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-dark-card border-t border-dark-border text-center">
        <p className="section-subtitle">განიცადე ჩვენთან</p>
        <h2 className="text-3xl font-serif text-cream mb-6">მოგვიყეთ სტუმრად</h2>
        <div className="gold-divider" />
        <Link href="/reservation" className="btn-primary">
          მაგიდის ჯავშანი
        </Link>
      </section>
    </>
  )
}
