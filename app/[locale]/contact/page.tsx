import { setRequestLocale } from 'next-intl/server'
import ContactContent from '@/components/ContactContent'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <ContactContent />
}
