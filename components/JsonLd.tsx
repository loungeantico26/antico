import { SITE_URL } from '@/lib/seo'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Lounge Antico',
  alternateName: 'Antico',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: [`${SITE_URL}/og-image.png`],
  description: 'Georgian and European cuisine across from the Dendrological Park in Shekvetili, Ozurgeti, Georgia. Outdoor seating, large bus parking, open daily.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shekvetili (Natanebi)',
    addressLocality: 'Ozurgeti',
    addressCountry: 'GE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.9594447,
    longitude: 41.7731486,
  },
  telephone: '+995591403832',
  email: 'lounge.antico26@gmail.com',
  sameAs: [
    'https://www.instagram.com/lounge.antico/',
    'https://www.google.com/maps/place/Lounge+Antico+Restaurant/@41.9594447,41.7731486,17z',
  ],
  servesCuisine: ['Georgian', 'European'],
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
