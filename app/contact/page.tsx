import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const info = [
  {
    icon: MapPin,
    title: 'მისამართი',
    lines: ['რუსთაველის გამზ. 12', 'თბილისი, საქართველო'],
  },
  {
    icon: Phone,
    title: 'ტელეფონი',
    lines: ['+995 322 123 456', '+995 599 123 456'],
  },
  {
    icon: Mail,
    title: 'ელ. ფოსტა',
    lines: ['info@antico.ge', 'reservations@antico.ge'],
  },
  {
    icon: Clock,
    title: 'სამუშაო საათები',
    lines: ['ორშ–პარ: 12:00–23:00', 'შაბ–კვი: 12:00–00:00'],
  },
]

export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center bg-dark-card border-b border-dark-border">
        <p className="section-subtitle">Antico Restaurant</p>
        <h1 className="section-title">კონტაქტი</h1>
        <div className="gold-divider" />
        <p className="text-cream/60 max-w-lg mx-auto text-sm">
          გვაქვს კითხვები? გვიპოვეთ ან მოგვწერეთ.
        </p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {info.map((item) => (
              <div key={item.title} className="card-dark p-8 text-center group hover:border-gold/40 transition-colors duration-300">
                <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <item.icon size={22} className="text-gold" />
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{item.title}</div>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-cream/70 text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="w-full h-80 bg-dark-card border border-dark-border flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-gold mx-auto mb-3" />
              <p className="text-cream/40 text-sm">რუსთაველის გამზ. 12, თბილისი</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs py-2 px-5 mt-4 inline-block"
              >
                Google Maps-ზე ნახვა
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
