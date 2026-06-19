import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Star, Clock, MapPin, Users } from 'lucide-react'

const features = [
  {
    icon: Star,
    title: 'პრემიუმ ხარისხი',
    desc: 'მხოლოდ სეზონური, ახალი ინგრედიენტები იტალიის საუკეთესო პროდუქტებთან ერთად.',
  },
  {
    icon: Users,
    title: 'პირადი სერვისი',
    desc: 'ყოველი სტუმარი განსაკუთრებულია. ჩვენი გუნდი ყოველთვის მზადაა.',
  },
  {
    icon: Clock,
    title: 'ყოველდღე ღია',
    desc: 'ორშაბათიდან კვირამდე, შუადღიდან შუაღამემდე.',
  },
  {
    icon: MapPin,
    title: 'პრესტიჟული მდებარეობა',
    desc: 'თბილისის გულში, რუსთაველის გამზირზე.',
  },
]

const testimonials = [
  {
    name: 'ნინო გ.',
    text: 'საოცარი ატმოსფერო და გემრიელი კერძები. ნამდვილად დავბრუნდები!',
    rating: 5,
  },
  {
    name: 'გიორგი მ.',
    text: 'Antico-ს ტრიუფელის პასტა საუკეთესოა მთელ ქალაქში.',
    rating: 5,
  },
  {
    name: 'მარიამ ბ.',
    text: 'სახელდახელი ვახშამი, რომელიც დაუვიწყარი გახდა. მადლობა!',
    rating: 5,
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
            alt="Antico Restaurant"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-dark/70" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <p className="section-subtitle">— თბილისი, საქართველო —</p>
          <h1 className="text-6xl md:text-8xl font-serif text-cream mb-6 leading-tight">
            ANTICO
          </h1>
          <div className="gold-divider" />
          <p className="text-cream/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
            იტალიური სამზარეულოს ხელოვნება, ქართული სტუმართმოყვარეობის სულით
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation" className="btn-primary">
              მაგიდის ჯავშანი
            </Link>
            <Link href="/menu" className="btn-outline">
              მენიუს ნახვა
            </Link>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold animate-bounce"
        >
          <ChevronDown size={32} />
        </a>
      </section>

      {/* About */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle">ჩვენს შესახებ</p>
            <h2 className="section-title">სადაც კვება<br />ხელოვნებად იქცევა</h2>
            <div className="w-16 h-px bg-gold mb-8" />
            <p className="text-cream/70 leading-relaxed mb-6">
              2015 წლიდან Antico-ს გუნდი შეუდგა იტალიური სამზარეულოს ქართულ სარბიელზე
              გაცნობას. ჩვენი შეფ-მზარეული ტრადიციებს პატივს სცემს, მაგრამ
              შემოქმედებას არ ავიწყდება.
            </p>
            <p className="text-cream/70 leading-relaxed mb-10">
              ყოველი ვახშამი — განსაკუთრებული შეხვედრაა. ჩვენ ვქმნით ატმოსფეროს,
              სადაც ოჯახი, მეგობრები და ბიზნეს-პარტნიორები ერთ სუფრასთან ჯდებიან.
            </p>
            <Link href="/gallery" className="btn-outline">
              გალერეის ნახვა
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Chef at Antico"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 card-dark p-6 w-48">
              <div className="text-5xl font-serif text-gold">9+</div>
              <div className="text-cream/60 text-sm mt-1">წლის გამოცდილება</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle">რატომ Antico</p>
            <h2 className="section-title">ჩვენი პირობა</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center group">
                <div className="w-16 h-16 border border-gold/40 flex items-center justify-center mx-auto mb-6 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <f.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-cream font-serif text-xl mb-3">{f.title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="section-subtitle">გემო</p>
          <h2 className="section-title">შეფ-მზარეულის რჩეულები</h2>
          <div className="gold-divider" />
          <p className="text-cream/60 mb-12 max-w-xl mx-auto">
            სეზონური ინგრედიენტებით, ხელით მომზადებული პასტა, ახალი ზღვის პროდუქტები
            და ტრადიციული იტალიური დესერტები.
          </p>
          <Link href="/menu" className="btn-primary">
            სრული მენიუ
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle">სტუმართა შეფასებები</p>
            <h2 className="section-title">რას ამბობენ ჩვენზე</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card-dark p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-cream/70 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="text-gold font-serif">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
            alt="Restaurant atmosphere"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="section-subtitle">დაჯავშნეთ ახლავე</p>
          <h2 className="section-title">გამოგიცდიათ<br />Antico-ს გემო?</h2>
          <div className="gold-divider" />
          <p className="text-cream/70 mb-10">
            ჩვენი გუნდი მზადაა განსაკუთრებული საღამო მოგიმზადოთ.
            დაჯავშნეთ მაგიდა ახლავე.
          </p>
          <Link href="/reservation" className="btn-primary">
            მაგიდის ჯავშანი
          </Link>
        </div>
      </section>
    </>
  )
}
