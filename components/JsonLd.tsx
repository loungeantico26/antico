import { SITE_URL } from '@/lib/seo'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Lounge Antico',
  alternateName: 'Antico',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  ],
  description: 'Premium Italian restaurant with Georgian hospitality on Rustaveli Avenue, Tbilisi.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rustaveli Ave. 12',
    addressLocality: 'Tbilisi',
    addressCountry: 'GE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.6938,
    longitude: 44.8015,
  },
  telephone: '+995322123456',
  email: 'info@antico.ge',
  servesCuisine: ['Italian', 'European', 'Mediterranean'],
  priceRange: '₾₾₾',
  currenciesAccepted: 'GEL',
  paymentAccepted: 'Cash, Credit Card',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '12:00',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '12:00',
      closes: '00:00',
    },
  ],
  hasMap: 'https://maps.google.com',
  reservations: 'Required',
  acceptsReservations: true,
  menu: `${SITE_URL}/ka/menu`,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Lounge Area', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Takeout', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pre-order', value: true },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '3',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'ნინო გ.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'საოცარი ატმოსფერო და გემრიელი კერძები. ნამდვილად დავბრუნდები!',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'გიორგი მ.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Antico-ს ტრიუფელის პასტა საუკეთესოა მთელ ქალაქში.',
    },
  ],
}

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
