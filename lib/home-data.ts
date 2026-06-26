import { createClient } from '@supabase/supabase-js'
import contentJson from '@/data/content.json'

export type Feature = { icon: string; title: string; desc: string }
export type Testimonial = { id: string; name: string; text: string; rating: number }
export type HeroData = { backgroundUrl: string; badge: string; heading: string; subheading: string; cta1: string; cta2: string }
export type AboutData = { badge: string; heading: string; text1: string; text2: string; imageUrl: string; yearsLabel: string; yearsText: string; cta: string }
export type CtaData = { backgroundUrl: string; badge: string; heading: string; text: string; cta: string }

export type HomeData = {
  hero: HeroData
  about: AboutData
  features: Feature[]
  cta: CtaData
  testimonials: Testimonial[]
}

export const fallback: HomeData = {
  hero: contentJson.hero as HeroData,
  about: contentJson.about as AboutData,
  features: contentJson.features as Feature[],
  cta: contentJson.cta as CtaData,
  testimonials: contentJson.testimonials as Testimonial[],
}

// Returns true for any URL that is not a local path (external, base64, blob, etc.)
function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false
  return !url.startsWith('/')
}

function isStale(obj: unknown): boolean {
  const s = JSON.stringify(obj || '').toLowerCase()
  return (
    s.includes('italian') ||
    s.includes('ristorante') ||
    s.includes('lorem ipsum') ||
    s.includes('fine dining') ||
    s.includes('passion for food')
  )
}

// Ensure all image URL fields are local paths; replace external/data/blob with fallback
function sanitizeImageUrl(url: string | undefined, fallbackUrl: string): string {
  if (!url || isExternalUrl(url)) return fallbackUrl
  return url
}

export async function fetchHomeData(): Promise<HomeData> {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [contentRes, testimonialsRes] = await Promise.all([
    sb.from('site_content').select('key, value').in('key', ['hero', 'about', 'features', 'cta']),
    sb.from('testimonials').select('*').order('sort_order'),
  ])

  const map: Record<string, unknown> = {}
  ;(contentRes.data || []).forEach((row: { key: string; value: unknown }) => { map[row.key] = row.value })

  const sbHero = map.hero as HeroData
  const sbAbout = map.about as AboutData
  const sbCta = map.cta as CtaData

  const heroBase = (!sbHero || isStale(sbHero)) ? fallback.hero : sbHero
  const hero: HeroData = {
    ...heroBase,
    backgroundUrl: sanitizeImageUrl(heroBase.backgroundUrl, fallback.hero.backgroundUrl),
  }

  const aboutBase = (!sbAbout || sbAbout.text1?.includes('2015') || sbAbout.text1?.includes('იტალიური') || isStale(sbAbout)) ? fallback.about : sbAbout
  const about: AboutData = {
    ...aboutBase,
    imageUrl: sanitizeImageUrl(aboutBase.imageUrl, fallback.about.imageUrl),
  }

  const ctaBase = (!sbCta || isStale(sbCta)) ? fallback.cta : sbCta
  const cta: CtaData = {
    ...ctaBase,
    backgroundUrl: sanitizeImageUrl(ctaBase.backgroundUrl, fallback.cta.backgroundUrl),
  }

  return {
    hero,
    about,
    features: (map.features as Feature[]) || fallback.features,
    cta,
    testimonials: (testimonialsRes.data as Testimonial[])?.length
      ? (testimonialsRes.data as Testimonial[])
      : fallback.testimonials,
  }
}
